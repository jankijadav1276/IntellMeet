import { useEffect, useRef, useState, useCallback } from "react"
import { Socket } from "socket.io-client"
import useAuthStore from "../store/authStore"

interface RemotePeer {
  peerId: string
  name: string
  stream: MediaStream | null
}

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
}

export function useWebRTC(
  meetingId: string | undefined,
  socket: Socket | null
) {
  const { user } = useAuthStore()
  const lastMediaState = useRef({
  micOn: true,
  cameraOn: true,
})

  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remotePeers, setRemotePeers] = useState<RemotePeer[]>([])
  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] =
  useState(false)

const screenTrackRef =
  useRef<MediaStreamTrack | null>(null)
const cameraTrackRef =
  useRef<MediaStreamTrack | null>(null)
  const [isConnecting, setIsConnecting] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const localStreamRef = useRef<MediaStream | null>(null)
  const peerMap = useRef<Map<string, RTCPeerConnection>>(new Map())
  const pendingIceCandidates = useRef<
  Map<string, RTCIceCandidateInit[]>
> (new Map())

const makingOffer = useRef(false)
  /* ================= PEER CREATION ================= */
  const createPeer = useCallback(
    (peerId: string) => {
      if (peerMap.current.has(peerId)) {
        return peerMap.current.get(peerId)!
      }

      const pc = new RTCPeerConnection(ICE_SERVERS)

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket?.emit("webrtc-ice-candidate", {
            targetSocketId: peerId,
            candidate: event.candidate,
          })
        }
      }

pc.ontrack = (event) => {
  const [stream] = event.streams
  console.log(
  "TRACK RECEIVED:",
  peerId
)

  setRemotePeers((prev) => {
    const exists = prev.find(
      (p) => p.peerId === peerId
    )

    if (exists) {
      return prev.map((p) =>
        p.peerId === peerId
          ? { ...p, stream }
          : p
      )
    }

    return [
      ...prev,
      {
        peerId,
        name: "Participant",
        stream,
      },
    ]
  })
}

      localStreamRef.current?.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!)
      })

      peerMap.current.set(peerId, pc)
      return pc
    },
    [socket]
  )

  /* ================= INIT ================= */
  useEffect(() => {
    if (!meetingId || !user || !socket) return

    let mounted = true

    const handlers: Record<string, any> = {}

    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })

        if (!mounted) return

        localStreamRef.current = stream
        cameraTrackRef.current =
  stream.getVideoTracks()[0]
        setLocalStream(stream)
        setIsConnecting(false)

        /* ================= ROOM SYNC ================= */
handlers.roomUpdate = (data: any) => {
  const participants = data.participants || []

  const activeIds = participants.map(
    (p: any) => p.socketId
  )

  // Close removed peer connections
  peerMap.current.forEach((pc, peerId) => {
    if (!activeIds.includes(peerId)) {
      pc.close()
      peerMap.current.delete(peerId)
      pendingIceCandidates.current.delete(peerId)
    }
  })

  setRemotePeers((prev) =>
    prev.filter((peer) =>
      activeIds.includes(peer.peerId)
    )
  )

participants.forEach(async (p: any) => {
  if (p.socketId === socket.id) return

  const exists = peerMap.current.has(
    p.socketId
  )

  setRemotePeers((prev) => {
    if (
      prev.some(
        (peer) => peer.peerId === p.socketId
      )
    ) {
      return prev
    }

    return [
      ...prev,
      {
        peerId: p.socketId,
        name: p.name,
        stream: null,
      },
    ]
  })

})
}

        /* ================= USER JOINED ================= */
        handlers.userJoined = async (data: any) => {
          const { newUser } = data
          

          if (!newUser || newUser.socketId === socket.id) return

          setRemotePeers((prev) => {
            if (prev.some((p) => p.peerId === newUser.socketId)) return prev

            return [
              ...prev,
              {
                peerId: newUser.socketId,
                name: newUser.name,
                stream: null,
              },
            ]
          })

console.log(
  "USER JOINED:",
  newUser.name,
  newUser.socketId
)

const pc = createPeer(newUser.socketId)


try {
  makingOffer.current = true

  const offer = await pc.createOffer()

  await pc.setLocalDescription(offer)

  socket.emit("webrtc-offer", {
    targetSocketId: newUser.socketId,
    offer,
  })
} finally {
  makingOffer.current = false
}
        }

        /* ================= OFFER ================= */
        handlers.offer = async ({ senderSocketId, offer }: any) => {
          console.log(
            "OFFER RECEIVED:",
            senderSocketId
          )
          const pc = createPeer(senderSocketId)

          await pc.setRemoteDescription(new RTCSessionDescription(offer))
          const queued =
              pendingIceCandidates.current.get(senderSocketId) || []

              for (const candidate of queued) {
                await pc.addIceCandidate(new RTCIceCandidate(candidate))
              }

              pendingIceCandidates.current.delete(senderSocketId)

          const answer = await pc.createAnswer()
          await pc.setLocalDescription(answer)

          socket.emit("webrtc-answer", {
            targetSocketId: senderSocketId,
            answer,
          })
        }

        /* ================= ANSWER ================= */
        handlers.answer = async ({ senderSocketId, answer }: any) => {

          console.log(
  "ANSWER RECEIVED:",
  senderSocketId
)
          const pc = peerMap.current.get(senderSocketId)

          if (pc) {
            await pc.setRemoteDescription(
              new RTCSessionDescription(answer)
            )
            const queued =
              pendingIceCandidates.current.get(senderSocketId) || []

            for (const candidate of queued) {
              await pc.addIceCandidate(new RTCIceCandidate(candidate))
            }

            pendingIceCandidates.current.delete(senderSocketId)
          }
        }

        /* ================= ICE ================= */
        handlers.ice = async ({ senderSocketId, candidate }: any) => {
          const pc = peerMap.current.get(senderSocketId)

          if (
            pc &&
            pc.remoteDescription &&
            pc.remoteDescription.type
          ) {
            await pc.addIceCandidate(
              new RTCIceCandidate(candidate)
            )
          } else {
            const queue =
              pendingIceCandidates.current.get(senderSocketId) || []

            queue.push(candidate)

            pendingIceCandidates.current.set(
              senderSocketId,
              queue
            )
          }
        }

        /* ================= USER LEFT ================= */
        handlers.userLeft = ({ socketId }: any) => {
          peerMap.current.get(socketId)?.close()
          peerMap.current.delete(socketId)
          pendingIceCandidates.current.delete(socketId)

          setRemotePeers((prev) =>
            prev.filter((p) => p.peerId !== socketId)
          )
        }

        /* ================= REGISTER EVENTS ================= */
        socket.on("room-update", handlers.roomUpdate)
        socket.on("user-joined", handlers.userJoined)
        socket.on("webrtc-offer", handlers.offer)
        socket.on("webrtc-answer", handlers.answer)
        socket.on("webrtc-ice-candidate", handlers.ice)
        socket.on("user-left", handlers.userLeft)
            handlers.forceMute = () => {
            const audioTrack =
              localStreamRef.current?.getAudioTracks()[0]

            if (audioTrack) {
              audioTrack.enabled = false
              setMicOn(false)

              lastMediaState.current.micOn = false

              socket.emit("media-state", {
                micOn: false,
                cameraOn: lastMediaState.current.cameraOn,
              })

              alert("Host muted your microphone.")
            }
          }

        socket.on("force-mute", handlers.forceMute)
      } catch (err: any) {
  console.error(err)

  if (
    err.name === "NotAllowedError"
  ) {
    setError(
      "Camera/Microphone permission denied"
    )
  } else if (
    err.name === "NotFoundError"
  ) {
    setError(
      "No camera or microphone found"
    )
  } else {
    setError(
      "Unable to access media devices"
    )
  }

  setIsConnecting(false)
}
    }

    init()

    return () => {
      mounted = false

      socket.off("room-update", handlers.roomUpdate)
      socket.off("user-joined", handlers.userJoined)
      socket.off("webrtc-offer", handlers.offer)
      socket.off("webrtc-answer", handlers.answer)
      socket.off("webrtc-ice-candidate", handlers.ice)
      socket.off("user-left", handlers.userLeft)
      socket.off("force-mute", handlers.forceMute)

        

      localStreamRef.current?.getTracks().forEach((t) => t.stop())

      peerMap.current.forEach((pc) => pc.close())
      peerMap.current.clear()

      socket.emit("leaveMeeting", {
        meetingId,
      })
    }
  }, [meetingId, user, socket, createPeer])

const replaceVideoTrack = useCallback(
  async (newTrack: MediaStreamTrack) => {

    const promises: Promise<void>[] = []

    peerMap.current.forEach((pc) => {

      const sender = pc
        .getSenders()
        .find(
          (s) =>
            s.track?.kind === "video"
        )

      if (sender) {
        promises.push(
          sender.replaceTrack(newTrack)
        )
      }
    })

    await Promise.all(promises)
  },
  []
)

const stopScreenShare = useCallback(async () => {

const cameraTrack =
  cameraTrackRef.current

  if (!cameraTrack) return

await replaceVideoTrack(cameraTrack)

peerMap.current.forEach(
  async (pc, peerId) => {

    const offer =
      await pc.createOffer()

    await pc.setLocalDescription(
      offer
    )

    socket?.emit(
      "webrtc-offer",
      {
        targetSocketId: peerId,
        offer,
      }
    )
  }
)

const audioTrack =
  localStreamRef.current
    ?.getAudioTracks()[0]

const restoredStream =
  new MediaStream([
    cameraTrack,
    ...(audioTrack ? [audioTrack] : []),
  ])

localStreamRef.current =
  restoredStream

setLocalStream(restoredStream)

screenTrackRef.current?.stop()
screenTrackRef.current = null

setIsScreenSharing(false)

}, [replaceVideoTrack, localStream])


const startScreenShare = useCallback(
  async () => {

    try {

      const screenStream =
        await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        })

      const screenTrack =
        screenStream.getVideoTracks()[0]

      if (!screenTrack) return

screenTrackRef.current = screenTrack

const audioTrack =
  localStreamRef.current
    ?.getAudioTracks()[0]

const newStream = new MediaStream([
  screenTrack,
  ...(audioTrack ? [audioTrack] : []),
])

localStreamRef.current = newStream
setLocalStream(newStream)

await replaceVideoTrack(screenTrack)

peerMap.current.forEach(
  async (pc, peerId) => {

    const offer =
      await pc.createOffer()

    await pc.setLocalDescription(
      offer
    )

    socket?.emit(
      "webrtc-offer",
      {
        targetSocketId: peerId,
        offer,
      }
    )
  }
)

setIsScreenSharing(true)

      screenTrack.onended = () => {
        stopScreenShare()
      }

    } catch (err) {
      console.error(err)
    }
  },
  [replaceVideoTrack,
    stopScreenShare,
  ]
)



const toggleScreenShare =
  useCallback(() => {

    if (isScreenSharing) {
      stopScreenShare()
    } else {
      startScreenShare()
    }

  }, [
    isScreenSharing,
    startScreenShare,
    stopScreenShare,
  ])
  /* ================= CONTROLS ================= */
  const toggleMic = useCallback(() => {
  const track =
    localStreamRef.current?.getAudioTracks()[0]

  if (!track) return

  track.enabled = !track.enabled

  setMicOn(track.enabled)

  lastMediaState.current.micOn = track.enabled

  socket?.emit("media-state", {
    micOn: track.enabled,
    cameraOn: lastMediaState.current.cameraOn,
  })
}, [socket])

 const toggleCamera = useCallback(() => {
  const track =
    localStreamRef.current?.getVideoTracks()[0]

  if (!track) return

  track.enabled = !track.enabled

  setCameraOn(track.enabled)

  lastMediaState.current.cameraOn = track.enabled

  socket?.emit("media-state", {
    micOn: lastMediaState.current.micOn,
    cameraOn: track.enabled,
  })
}, [socket])

  const leaveCall = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop())

    peerMap.current.forEach((pc) => pc.close())
    peerMap.current.clear()
    pendingIceCandidates.current.clear()

    socket?.emit("leaveMeeting", {
  meetingId,
})

    setLocalStream(null)
    setRemotePeers([])
  }, [meetingId, socket])

return {
  localStream,
  remotePeers,

  micOn,
  cameraOn,

  isScreenSharing,
  toggleScreenShare,

  toggleMic,
  toggleCamera,

  leaveCall,
  isConnecting,
  error,
}
}