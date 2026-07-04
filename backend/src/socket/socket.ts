import { Server, Socket } from "socket.io"
import http from "http"
import Meeting from "../models/Meeting"
import { processMeetingAI } from "../services/ai/meetingAI.service"

let io: Server

type Participant = {
  socketId: string
  userId: string
  name: string
  isHost: boolean
  micOn: boolean
  cameraOn: boolean
  raisedHand: boolean
  speakingLevel: number
}

export const rooms: Record<string, Participant[]> = {}

const reconnectTimers: Record<
  string,
  NodeJS.Timeout
> = {}

export const emitWaitingRoomUpdate = async (
  meetingId: string
) => {
  const meeting = await Meeting.findById(
    meetingId,
    {
      waitingParticipants: 1,
    }
  )

  if (!meeting) return

  io.to(meetingId).emit(
    "waiting-room:update",
    {
      waitingParticipants:
        meeting.waitingParticipants,
    }
  )
}

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  })

  io.on("connection", (socket: Socket) => {
    console.log("🔌 Connected:", socket.id)

    let currentMeetingId: string | null = null

    /* ================= JOIN ROOM ================= */
        socket.on(
      "join-room",
      async (data: {
        meetingId: string
        userId: string
        name: string
      }) => {
        const meetingId = data.meetingId.trim()
        console.log(
        "JOIN MEETING ID:",
        JSON.stringify(meetingId)
      )
      const userId = data.userId
      const name = data.name

        if (reconnectTimers[userId]) {
        clearTimeout(reconnectTimers[userId])
        delete reconnectTimers[userId]

        console.log(
          `✅ ${userId} reconnected`
        )
      }

        socket.data.userId = userId
        socket.data.name = name
        socket.data.meetingId = meetingId
        socket.data.left = false

        currentMeetingId = meetingId

        socket.join(meetingId)
        socket.join(userId)

        if (!rooms[meetingId]) {
          rooms[meetingId] = []
        }

       const meeting = await Meeting.findById(
        meetingId
      )

        console.log("JOIN ROOM:", meetingId)
        console.log("MEETING FOUND:", !!meeting)

        if (!meeting) {
          socket.emit("meeting-not-found")
          return
        }

        if (!meeting.participants) {
          meeting.participants = []
        }

        const isHost =
          meeting.host.toString() ===
          userId

        /* Remove existing entry of same user */
        rooms[meetingId] = rooms[meetingId].filter(
          (p) => p.userId !== userId
        )

       const newUser: Participant = {
        socketId: socket.id,
        userId,
        name,

        isHost:
          meeting.host.toString() === userId,

        micOn: true,
        cameraOn: true,
        raisedHand: false,
        speakingLevel: 0,
      }

        rooms[meetingId].push(newUser)

        // Send existing users to the newly joined participant
const existingUsers = rooms[meetingId]
  .filter((p) => p.socketId !== socket.id)
  .map((p) => ({
    socketId: p.socketId,
    userId: p.userId,
    name: p.name,
  }))

socket.emit("existing-users", existingUsers)

      const existingParticipant = await Meeting.findOne({
        _id: meetingId,
        "participants.user": userId,
      })

      if (!existingParticipant) {
        await Meeting.findByIdAndUpdate(
          meetingId,
          {
            $push: {
              participants: {
                user: userId,
                role: isHost ? "host" : "participant",
                isActive: true,
                joinedAt: new Date(),
              },
            },
          }
        )
      } else {
        await Meeting.findOneAndUpdate(
          {
            _id: meetingId,
            "participants.user": userId,
          },
          {
            $set: {
              "participants.$.isActive": true,
            },
          }
        )
      }

        console.log(`👥 ${name} joined ${meetingId}`)

        console.log(
        "ROOM UPDATE:",
        JSON.stringify(
          rooms[meetingId],
          null,
          2
        )
      )

        io.to(meetingId).emit("room-update", {
          participants: rooms[meetingId],
        })
       
      socket.to(meetingId).emit("user-joined", {
        newUser,
      })
        io.to(meetingId).emit("participant-db-updated")

        /* Send previous chat history */
        const meetingChats = await Meeting.findById(
          meetingId,
          { chats: 1 }
        )

      socket.emit(
        "chat-history",
        meetingChats?.chats || []
      )

      if (isHost) {
  await emitWaitingRoomUpdate(meetingId)
}
              }
            )

    /* ================= CHAT ================= */
            socket.on("sendMessage", async (data) => {
               console.log("📨 CHAT RECEIVED:", data)
               console.log("📨 CHAT:", data.message)
                console.log("📨 SOCKET ROOM:", socket.data.meetingId)
                console.log("📨 ROOM USERS:", rooms[data.meetingId]?.length)
          try {
          const chat = {
            userId: data.userId,
            name: data.name,
            message: (data.message || "").trim(),
            timestamp: new Date(),
          }

            /* Save in MongoDB */
            const meeting =
              await Meeting.findByIdAndUpdate(
                data.meetingId,
                {
                  $push: {
                    chats: chat,
                  },
                },
                {
                  new: true,
                }
              )

            if (!meeting) {
              console.log(
                `Meeting not found: ${data.meetingId}`
              )
              return
            }
            /* Broadcast */
           const roomId = socket.data.meetingId
            console.log("📢 EMITTING TO ROOM:", roomId)
            if (!roomId) return

            io.to(roomId).emit("receiveMessage", chat)
            console.log("📢 BROADCASTING TO:", roomId)

          } catch (error) {
            console.error(
              "❌ Chat save error:",
              error
            )
          }
        })

  socket.on("typing", (data) => {
  socket.to(data.meetingId).emit("user-typing", {
    userId: data.userId,
    name: data.name,
  })
})

socket.on("stop-typing", (data) => {
  socket.to(data.meetingId).emit("user-stop-typing", {
    userId: data.userId,
  })
})

/* ================= LIVE TRANSCRIPT ================= */

socket.on(
  "live-transcript",
  async (data: {
    meetingId: string
    speaker: string
    text: string
  }) => {
    const roomId = socket.data.meetingId

    if (!roomId) return

    if (!data.text?.trim()) return

    const transcriptEntry = {
      speaker: data.speaker,
      text: data.text.trim(),
      timestamp: new Date(),
    }

    try {
      await Meeting.findByIdAndUpdate(
        roomId,
        {
          $push: {
            transcript: transcriptEntry,
          },
        }
      )
    } catch (error) {
      console.error(
        "Transcript save failed:",
        error
      )
    }

    io.to(roomId).emit(
      "live-transcript",
      transcriptEntry
    )
  }
)

/* ================= LIVE REACTIONS ================= */

socket.on(
  "send-reaction",
  ({ meetingId, userId, name, emoji }) => {
    console.log("🔥 send-reaction event fired");
    console.log({
      meetingId,
      userId,
      name,
      emoji,
    });

    if (!meetingId) {
      console.log("❌ meetingId missing");
      return;
    }

    io.to(meetingId).emit("reaction-received", {
      socketId: socket.id,
      userId,
      name,
      emoji,
    });

    console.log("✅ reaction broadcasted");
  }
);

    /* ================= MEDIA STATE ================= */
    socket.on("media-state", ({ micOn, cameraOn }) => {
      const meetingId = socket.data.meetingId
      if (!meetingId || !rooms[meetingId]) return

      rooms[meetingId] = rooms[meetingId].map((p) =>
        p.socketId === socket.id
          ? { ...p, micOn, cameraOn }
          : p
      )

      io.to(meetingId).emit("room-update", {
        participants: rooms[meetingId],
      })
    })

    /* ================= LEAVE ================= */
   socket.on("leaveMeeting", async ({ meetingId }) => {
  if (!meetingId) return
  if (socket.data.left) return

  socket.data.left = true

  await handleLeave(socket, meetingId)
})


/* ================= RECORDING ================= */


socket.on(
"recording-started",
(data)=>{

const meetingId=
socket.data.meetingId

if(!meetingId)return


io.to(meetingId).emit(
"recording-status",
{
recording:true,
startedBy:data.userId
}
)

})


socket.on(
"recording-stopped",
()=>{


const meetingId=
socket.data.meetingId

if(!meetingId)return


io.to(meetingId).emit(
"recording-status",
{
recording:false
}
)


})


/* ================= JOIN WAITING ROOM ================= */

socket.on(
  "join-waiting-room",
  async ({ meetingId, userId, name }) => {

    const meeting = await Meeting.findById(meetingId)

    if (!meeting) {
      socket.emit("meeting-not-found")
      return
    }

    const alreadyWaiting = meeting.waitingParticipants.some(
      (p: any) => p.user.toString() === userId
    )

    if (alreadyWaiting) return

    meeting.waitingParticipants.push({
      user: userId,
      name,
      joinedAt: new Date(),
    } as any)

    await meeting.save()

    await emitWaitingRoomUpdate(meetingId)

    console.log(`${name} joined waiting room`)
  }
)
/* ================= HOST APPROVE WAITING USER ================= */

socket.on(
  "approve-participant",
  async ({ meetingId, userId }) => {
    const roomId = socket.data.meetingId
    if (!roomId) return

    const host = rooms[roomId]?.find(
      (p) => p.socketId === socket.id
    )

    if (!host?.isHost) return

    const meeting = await Meeting.findById(roomId)

    if (!meeting) return

    const waitingUser = meeting.waitingParticipants.find(
      (p: any) => p.user.toString() === userId
    )

    if (!waitingUser) return

    meeting.waitingParticipants =
      meeting.waitingParticipants.filter(
        (p: any) => p.user.toString() !== userId
      )

    meeting.participants.push({
      user: waitingUser.user,
      role: "participant",
      joinedAt: new Date(),
      isActive: true,
    })

    meeting.totalParticipantsJoined += 1

    await meeting.save()

    await emitWaitingRoomUpdate(roomId)

    io.to(roomId).emit("participant-db-updated")

    io.emit(`approved:${userId}`, {
      meetingId: roomId,
    })
  }
)

/* ================= HOST ACCEPTS ALL WAITING USER ================= */

socket.on(
  "approve-all-participants",
  async ({ meetingId }) => {
    const roomId = socket.data.meetingId
    if (!roomId) return

    const host = rooms[roomId]?.find(
      (p) => p.socketId === socket.id
    )

    if (!host?.isHost) return

    const meeting = await Meeting.findById(roomId)

    if (!meeting) return

    // Move every waiting participant into the meeting
    meeting.waitingParticipants.forEach((waitingUser: any) => {
      meeting.participants.push({
        user: waitingUser.user,
        role: "participant",
        joinedAt: new Date(),
        isActive: true,
      })

      meeting.totalParticipantsJoined += 1
    })

    // Clear waiting room
    meeting.waitingParticipants = []

    await meeting.save()

    await emitWaitingRoomUpdate(roomId)

    io.to(roomId).emit("participant-db-updated")

    // Notify every approved participant
    meeting.participants.forEach((participant: any) => {
      io.emit(`approved:${participant.user.toString()}`, {
        meetingId: roomId,
      })
    })
  }
)/* ================= HOST REJECT WAITING USER ================= */

socket.on(
  "reject-participant",
  async ({ meetingId, userId }) => {
    const roomId = socket.data.meetingId
    if (!roomId) return

    const host = rooms[roomId]?.find(
      (p) => p.socketId === socket.id
    )

    if (!host?.isHost) return

    const meeting = await Meeting.findById(roomId)

    if (!meeting) return

    meeting.waitingParticipants =
      meeting.waitingParticipants.filter(
        (p: any) => p.user.toString() !== userId
      )

    await meeting.save()

    await emitWaitingRoomUpdate(roomId)

    io.emit(`rejected:${userId}`)
  }
)

    /* ================= WEBRTC ================= */
const isValidParticipant = (meetingId: string, socketId: string) => {
  return rooms[meetingId]?.some(
    (p) => p.socketId === socketId
  )
}

/* ================= WEBRTC OFFER ================= */
socket.on("webrtc-offer", ({ targetSocketId, offer }) => {
  console.log(
    "📤 OFFER",
    socket.id,
    "->",
    targetSocketId
  )
  const meetingId = socket.data.meetingId
  if (!meetingId) return

  if (!isValidParticipant(meetingId, targetSocketId)) return

  io.to(targetSocketId).emit("webrtc-offer", {
    senderSocketId: socket.id,
    offer,
  })
})

/* ================= WEBRTC ANSWER ================= */
socket.on("webrtc-answer", ({ targetSocketId, answer }) => {
  const meetingId = socket.data.meetingId
  if (!meetingId) return

  if (!isValidParticipant(meetingId, targetSocketId)) return
  console.log(
  "📤 ANSWER",
  socket.id,
  "->",
  targetSocketId
)

  io.to(targetSocketId).emit("webrtc-answer", {
    senderSocketId: socket.id,
    answer,
  })
})

/* ================= WEBRTC ICE ================= */
socket.on("webrtc-ice-candidate", ({ targetSocketId, candidate }) => {
  const meetingId = socket.data.meetingId
  if (!meetingId) return

  if (!isValidParticipant(meetingId, targetSocketId)) return

  console.log(
  "🧊 ICE",
  socket.id,
  "->",
  targetSocketId
)
  io.to(targetSocketId).emit("webrtc-ice-candidate", {
    senderSocketId: socket.id,
    candidate,
  })
})

    /* ================= HAND RAISE ================= */
   socket.on("raise-hand", async (data) => {
  const meetingId = socket.data.meetingId
  if (!meetingId) return

  rooms[meetingId] = rooms[meetingId].map((p) =>
    p.socketId === socket.id
      ? { ...p, raisedHand: !!data.raised }
      : p
  )

 await Meeting.findByIdAndUpdate(
  meetingId,
  {
    $set: {
      "participants.$.raisedHand":
        !!data.raised,
    },
  }
)
  io.to(meetingId).emit("participant-db-updated")

  io.to(meetingId).emit("hand-update", {
    participants: rooms[meetingId],
    raisedBy: {
      socketId: socket.id,
      userId: data.userId,
      name: data.name,
      raised: data.raised,
    },
  })
  
})

    /* ================= ACTIVE SPEAKER ================= */
   let lastAudioEmit = 0

socket.on("audio-level", ({ level }) => {
  const now = Date.now()
  if (now - lastAudioEmit < 100) return
  lastAudioEmit = now

  const meetingId = socket.data.meetingId
  if (!meetingId) return
  const user = rooms[meetingId]?.find(
  (p) => p.socketId === socket.id
)

if (!user) return
if (!rooms[meetingId]?.length) return

  rooms[meetingId] = rooms[meetingId].map((p) =>
    p.socketId === socket.id
      ? { ...p, speakingLevel: level }
      : p
  )

  io.to(meetingId).emit("active-speaker", {
    socketId: socket.id,
    level,
  })
})


    /* ================= HOST: FORCE MUTE ================= */
    socket.on("mute-user", ({ targetSocketId }) => {
      const meetingId = socket.data.meetingId
      if (!meetingId) return

      const host = rooms[meetingId]?.find(
        (p) => p.socketId === socket.id
      )

      if (!host?.isHost) return

      io.to(targetSocketId).emit("force-mute")
    })

    /* ================= HOST: REMOVE USER ================= */
    socket.on("remove-user", async ({ targetSocketId }) => {
  const meetingId = socket.data.meetingId
  if (!meetingId) return

  const host = rooms[meetingId]?.find(
    (p) => p.socketId === socket.id
  )

  if (!host?.isHost) return

  const targetExists = rooms[meetingId]?.some(
    (p) => p.socketId === targetSocketId
  )

  if (!targetExists) return

  const targetSocket = io.sockets.sockets.get(targetSocketId)

  if (targetSocket) {
  targetSocket.data.left = true
  await handleLeave(targetSocket, meetingId)
}

  io.to(targetSocketId).emit("removed-from-meeting")
})
/* ================= HOST: TRANSFER HOST ================= */

socket.on(
  "transfer-host",
  async ({ meetingId, newHostUserId }) => {

    const roomId = socket.data.meetingId
    if (!roomId) return

    const host = rooms[roomId]?.find(
      (p) => p.socketId === socket.id
    )

    if (!host?.isHost) return

    const meeting = await Meeting.findById(
      roomId
    )

    if (!meeting) return

    // ✅ FIX: host check AFTER meeting load
    if (meeting.host.toString() !== host.userId) return

    const newHostExists = rooms[roomId]?.some(
      (p) => p.userId === newHostUserId
    )

    if (!newHostExists) return

    meeting.host = newHostUserId as any

    meeting.participants = meeting.participants.map(
      (participant: any) => ({
        ...participant,
        role:
          participant.user.toString() === newHostUserId
            ? "host"
            : "participant",
      })
    )

    await meeting.save()

    rooms[roomId] = rooms[roomId].map((p) => ({
      ...p,
      isHost: p.userId === newHostUserId,
    }))

    io.to(roomId).emit("host-transferred", {
      newHostUserId,
      participants: rooms[roomId],
    })

    io.to(roomId).emit("room-update", {
      participants: rooms[roomId],
    })
  }
)

/* ================= HOST: APPROVE WAITING USER ================= */

socket.on(
  "waiting-room:approve",
  async ({ userId }) => {
    const meetingId = socket.data.meetingId

    if (!meetingId) return

    const host = rooms[meetingId]?.find(
      (p) => p.socketId === socket.id
    )

    if (!host?.isHost) return

    const meeting = await Meeting.findById(meetingId)

    if (!meeting) return

    const waitingUser =
      meeting.waitingParticipants.find(
        (p: any) =>
          p.user.toString() === userId
      )

    if (!waitingUser) return

    meeting.waitingParticipants =
      meeting.waitingParticipants.filter(
        (p: any) =>
          p.user.toString() !== userId
      )

    meeting.participants.push({
      user: waitingUser.user,
      role: "participant",
      joinedAt: new Date(),
      isActive: true,
    } as any)

    meeting.totalParticipantsJoined += 1

    await meeting.save()

    await emitWaitingRoomUpdate(meetingId)

    io.to(meetingId).emit(
      "waiting-room:approved",
      {
        userId,
      }
    )
  }
)

/* ================= HOST: REJECT WAITING USER ================= */

socket.on(
  "waiting-room:reject",
  async ({ userId }) => {
    const meetingId = socket.data.meetingId

    if (!meetingId) return

    const host = rooms[meetingId]?.find(
      (p) => p.socketId === socket.id
    )

    if (!host?.isHost) return

    const meeting = await Meeting.findById(
      meetingId
    )

    if (!meeting) return

    const waitingUser =
      meeting.waitingParticipants.find(
        (p: any) =>
          p.user.toString() === userId
      )

    if (!waitingUser) return

    meeting.waitingParticipants =
      meeting.waitingParticipants.filter(
        (p: any) =>
          p.user.toString() !== userId
      )

    await meeting.save()

    await emitWaitingRoomUpdate(
      meetingId
    )

    io.to(meetingId).emit(
      "waiting-room:rejected",
      {
        userId,
      }
    )
  }
)

    /* ================= HOST: END MEETING ================= */
socket.on("end-meeting", async () => {
  const meetingId = socket.data.meetingId

  if (!meetingId) return

  const host = rooms[meetingId]?.find(
    (p) => p.socketId === socket.id
  )

  if (!host?.isHost) return

  await Meeting.findByIdAndUpdate(
    meetingId,
    {
      status: "completed",
      endTime: new Date(),
    }
  )

  try {
    console.log(
      "Generating Meeting AI..."
    )

    await processMeetingAI(meetingId)

    console.log(
      "Meeting AI Completed"
    )
  } catch (error) {
    console.error(
      "Meeting AI Failed:",
      error
    )
  }

  io.to(meetingId).emit(
    "meeting-ended"
  )

  delete rooms[meetingId]
})
    /* ================= DISCONNECT ================= */
socket.on("disconnect", () => {
  console.log("❌ Disconnected:", socket.id)

  if (socket.data.left) return

  const meetingId = socket.data.meetingId
  const userId = socket.data.userId

  if (!meetingId || !userId) return

  io.to(meetingId).emit(
    "user-reconnecting",
    {
      userId,
    }
  )
  rooms[meetingId] = rooms[meetingId].map((p) =>
  p.userId === userId
    ? {
        ...p,
        micOn: false,
        cameraOn: false,
      }
    : p
)

io.to(meetingId).emit("room-update", {
  participants: rooms[meetingId],
})

  reconnectTimers[userId] =
    setTimeout(async () => {

      console.log(
        `⏰ Reconnect timeout: ${userId}`
      )

      socket.data.left = true

      await handleLeave(
        socket,
        meetingId
      )

      delete reconnectTimers[userId]

    }, 30000)
})

          /* ================= CLEANUP ================= */
async function handleLeave(socket: Socket, meetingId: string) {
  socket.data.meetingId = null
  socket.leave(meetingId)

  if (!rooms[meetingId]) return

  const leavingUser = rooms[meetingId].find(
    (p) => p.socketId === socket.id
  )

  if (leavingUser) {
    try {
await Meeting.findOneAndUpdate(
  {
    _id: meetingId,
    "participants.user": leavingUser.userId,
  },
  {
    $set: {
      "participants.$.isActive": false,
      "participants.$.leftAt": new Date(),
    },
  }
)
    } catch (err) {
      console.error("DB update failed:", err)
    }
  

  const wasHost = leavingUser?.isHost ?? false

if (wasHost) {

  rooms[meetingId] = rooms[meetingId].filter(
    (p) => p.socketId !== socket.id
  )

  if (rooms[meetingId].length > 0) {

    const newHost = rooms[meetingId][0]

await Meeting.findByIdAndUpdate(
  meetingId,
  {
    host: newHost.userId,
    $set: {
      "participants.$[oldHost].role":
        "participant",
      "participants.$[newHost].role":
        "host",
    },
  },
  {
    arrayFilters: [
      {
        "oldHost.user":
          leavingUser.userId,
      },
      {
        "newHost.user":
          newHost.userId,
      },
    ],
  }
)

    rooms[meetingId] = rooms[meetingId].map(
      (p) => ({
        ...p,
        isHost: p.userId === newHost.userId
      })
    )

    io.to(meetingId).emit(
      "host-transferred",
      {
        newHostUserId: newHost.userId,
        participants: rooms[meetingId]
      }
    )

    io.to(meetingId).emit("room-update", {
      participants: rooms[meetingId],
    })

  } else {

    await Meeting.findByIdAndUpdate(
      meetingId,
      {
        status: "completed",
        endTime: new Date()
      }
    )

    delete rooms[meetingId]
  }

  return
}

  rooms[meetingId] = rooms[meetingId].filter(
    (p) => p.socketId !== socket.id
  )

  if (rooms[meetingId].length === 0) {
    delete rooms[meetingId]
    return
  }

  io.to(meetingId).emit("room-update", {
    participants: rooms[meetingId],
  })

  io.to(meetingId).emit("user-left", {
    socketId: socket.id,
  })
  }
}
  })
}

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized")
  }

  return io
}