import { useEffect, useRef, useState, useCallback } from "react"
import { Socket } from "socket.io-client"
import useAuthStore from "../store/authStore"

interface RemotePeer {
  peerId: string
  name: string
  stream: MediaStream | null
  micOn?: boolean
  cameraOn?: boolean
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
  const [isScreenSharing, setIsScreenSharing] = useState(false)

  const screenTrackRef = useRef<MediaStreamTrack | null>(null)
  const cameraTrackRef = useRef<MediaStreamTrack | null>(null)
  const [isConnecting, setIsConnecting] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const localStreamRef = useRef<MediaStream | null>(null)
  const peerMap = useRef<Map<string, RTCPeerConnection>>(new Map())
  const remoteStreams = useRef<Map<string, MediaStream>>(new Map())
  const pendingIceCandidates = useRef<Map<string, RTCIceCandidateInit[]>>(new Map())

  const makingOffersSet = useRef<Set<string>>(new Set())
  const ignoreOfferMap = useRef<Map<string, boolean>>(new Map())

const makeOffer = useCallback(
  async (pc: RTCPeerConnection, peerId: string) => {
    if (!socket) return

    if (makingOffersSet.current.has(peerId)) {
      return
    }

    if (pc.signalingState !== "stable") {
      console.log("Skip offer. Signaling:", pc.signalingState)
      return
    }

    try {
      makingOffersSet.current.add(peerId)

      const offer = await pc.createOffer()

      if (pc.signalingState !== "stable") {
        return
      }

      await pc.setLocalDescription(offer)

      socket.emit("webrtc-offer", {
        targetSocketId: peerId,
        offer: pc.localDescription,
      })

      console.log("📤 Offer sent to", peerId)
    } catch (err) {
      console.error("Offer error:", err)
    } finally {
      makingOffersSet.current.delete(peerId)
    }
  },
  [socket]
)

  /* ================= PEER CREATION ================= */
const createPeer = useCallback(
  (peerId: string) => {
    const existing = peerMap.current.get(peerId)
    if (existing) {
      return existing
    }

    const pc = new RTCPeerConnection({
      iceServers: ICE_SERVERS.iceServers,
      bundlePolicy: "max-bundle",
      rtcpMuxPolicy: "require",
      iceCandidatePoolSize: 20,
    })

    // Add local tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!)
      })
    }

    // Receive remote tracks
    pc.ontrack = (event) => {
      console.log("🎥 Track:", peerId, event.track.kind)

      let remoteStream = remoteStreams.current.get(peerId)

      if (!remoteStream) {
        remoteStream = new MediaStream()
        remoteStreams.current.set(peerId, remoteStream)
      }

      if (
        !remoteStream.getTracks().some(
          (t) => t.id === event.track.id
        )
      ) {
        remoteStream.addTrack(event.track)
      }

      setRemotePeers((prev) =>
        prev.map((peer) =>
          peer.peerId === peerId
            ? {
                ...peer,
                stream: remoteStream!,
              }
            : peer
        )
      )
    }

    // ICE Candidate
    pc.onicecandidate = (event) => {
      if (!event.candidate) return

      socket?.emit("webrtc-ice-candidate", {
        targetSocketId: peerId,
        candidate: event.candidate,
      })
    }

    // ICE state
    pc.oniceconnectionstatechange = () => {
      console.log(
        "ICE:",
        peerId,
        pc.iceConnectionState
      )
    }

    // Connection state
    pc.onconnectionstatechange = () => {
      console.log(
        "Connection:",
        peerId,
        pc.connectionState
      )

      switch (pc.connectionState) {
        case "connected":
          break

        case "disconnected":
          setTimeout(() => {
            if (
              pc.connectionState === "disconnected"
            ) {
              pc.close()
            }
          }, 5000)
          break
case "failed":
case "closed":
  peerMap.current.delete(peerId)
  remoteStreams.current.delete(peerId)
  pendingIceCandidates.current.delete(peerId)
  makingOffersSet.current.delete(peerId)
  ignoreOfferMap.current.delete(peerId)

  pc.close()

  setRemotePeers((prev) =>
    prev.filter((p) => p.peerId !== peerId)
  )

  break
      }
    }

    peerMap.current.set(peerId, pc)

    return pc
  },
  [socket]
)

  /* ================= INIT & SIGNALING ROUTERS ================= */
  useEffect(() => {
    if (!meetingId || !user || !socket) return

    let mounted = true

   

const init = async () => {
  try {
    // 1. Get user media
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })

    // 2. Restore saved state
    const savedMic = sessionStorage.getItem("meetingMic")
    const savedCamera = sessionStorage.getItem("meetingCamera")

    const micEnabled = savedMic !== "false"
    const cameraEnabled = savedCamera !== "false"

    stream.getAudioTracks().forEach(track => {
      track.enabled = micEnabled
    })

    stream.getVideoTracks().forEach(track => {
      track.enabled = cameraEnabled
    })

    setMicOn(micEnabled)
    setCameraOn(cameraEnabled)

    lastMediaState.current = {
      micOn: micEnabled,
      cameraOn: cameraEnabled,
    }

    if (!mounted) {
      stream.getTracks().forEach(t => t.stop())
      return
    }

    // 3. Save stream
    localStreamRef.current = stream
    cameraTrackRef.current = stream.getVideoTracks()[0]
    setLocalStream(stream)
    setIsConnecting(false)

    // 4. Add tracks to existing peer connections
    peerMap.current.forEach((pc) => {
      stream.getTracks().forEach((track) => {
        const alreadyAdded = pc
          .getSenders()
          .some((s) => s.track?.id === track.id)

        if (!alreadyAdded) {
          pc.addTrack(track, stream)
        }
      })
    })

    // 5. Register listeners
    socket.on("room-update", handleRoomUpdate)
    socket.on("existing-users", handleExistingUsers)
    socket.on("user-joined", handleUserJoined)
    socket.on("webrtc-offer", handleOffer)
    socket.on("webrtc-answer", handleAnswer)
    socket.on("webrtc-ice-candidate", handleIce)
    socket.on("user-left", handleUserLeft)
    socket.on("force-mute", handleForceMute)

    // 6. Send media state
    socket.emit("media-state", {
      micOn: micEnabled,
      cameraOn: cameraEnabled,
    })

  } catch (err: any) {
    console.error(err)
    setError("Unable to access media devices")
    setIsConnecting(false)
  }
}

        /* ================= ROOM SYNC ================= */
const handleRoomUpdate = (data: any) => {
  const participants = data.participants || []

  const activeIds = participants.map(
    (p: any) => p.socketId
  )

      // 1. Remove track connections for users who actually left
      peerMap.current.forEach((pc, peerId) => {
        if (!activeIds.includes(peerId)) {
          pc.close()
          peerMap.current.delete(peerId)
          pendingIceCandidates.current.delete(peerId)
          remoteStreams.current.delete(peerId)
          makingOffersSet.current.delete(peerId)
          ignoreOfferMap.current.delete(peerId)
        }
      })

      // 2. Map structural state array updates safely without shifting ongoing video instances
      setRemotePeers((prev) => {
        return participants
          .filter((p: any) => p.socketId !== socket.id) // Filter out yourself
          .map((p: any) => {
            const existingPeer = prev.find((peer) => peer.peerId === p.socketId)
            return {
              peerId: p.socketId,
              name: p.name,
              stream: existingPeer ? existingPeer.stream : null,
              micOn: p.micOn ?? true,
              cameraOn: p.cameraOn ?? true,
            }
          })
      })

    }

    const handleUserJoined = async (data: any) => {
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
            micOn: newUser.micOn ?? true,
            cameraOn: newUser.cameraOn ?? true
          }
        ]
      })

     const pc = createPeer(newUser.socketId)

await new Promise(resolve => setTimeout(resolve, 100))

await makeOffer(pc, newUser.socketId)
    }

const handleOffer = async ({
  senderSocketId,
  offer,
}: any) => {
  console.log("📥 OFFER FROM:", senderSocketId)

  const pc = createPeer(senderSocketId)

  const makingOffer =
    makingOffersSet.current.has(senderSocketId)

  const polite = socket!.id! > senderSocketId

  const offerCollision =
    offer.type === "offer" &&
    (makingOffer || pc.signalingState !== "stable")

  if (offerCollision && !polite) {
    console.log("Ignoring colliding offer")
    return
  }

  try {
    if (
      offerCollision &&
      pc.signalingState === "have-local-offer"
    ) {
      await pc.setLocalDescription({
        type: "rollback",
      })
    }

    await pc.setRemoteDescription(
      new RTCSessionDescription(offer)
    )

    const queued =
      pendingIceCandidates.current.get(
        senderSocketId
      ) || []

    for (const candidate of queued) {
      try {
        await pc.addIceCandidate(
          new RTCIceCandidate(candidate)
        )
      } catch (err) {
        console.error("ICE Queue Error", err)
      }
    }

    pendingIceCandidates.current.delete(
      senderSocketId
    )

    const answer = await pc.createAnswer()

    await pc.setLocalDescription(answer)

    socket?.emit("webrtc-answer", {
      targetSocketId: senderSocketId,
      answer: pc.localDescription,
    })

    console.log("📤 ANSWER SENT:", senderSocketId)
  } catch (err) {
    console.error("Offer Handling Error:", err)
  }
}

const handleAnswer = async ({
  senderSocketId,
  answer,
}: any) => {
  const pc = peerMap.current.get(senderSocketId)

  if (!pc) {
    return
  }

  try {
    if (pc.signalingState !== "have-local-offer") {
      console.log(
        "Ignoring unexpected answer from",
        senderSocketId,
        pc.signalingState
      )
      return
    }

    await pc.setRemoteDescription(
      new RTCSessionDescription(answer)
    )

    const queued =
      pendingIceCandidates.current.get(senderSocketId) || []

    for (const candidate of queued) {
      try {
        await pc.addIceCandidate(
          new RTCIceCandidate(candidate)
        )
      } catch (err) {
        console.error("Queued ICE Error:", err)
      }
    }

    pendingIceCandidates.current.delete(senderSocketId)

    console.log("✅ Remote answer applied:", senderSocketId)
  } catch (err) {
    console.error("Answer handling failed:", err)
  }
}

    const handleIce = async ({ senderSocketId, candidate }: any) => {
      const pc = peerMap.current.get(senderSocketId)
      
      if (pc && pc.remoteDescription && pc.remoteDescription.type) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate))
        } catch (err) {
          console.log("Safe ignore transient ICE candidate parsing loop exception pathway.")
        }
      } else {
        const queue = pendingIceCandidates.current.get(senderSocketId) || []
        queue.push(candidate)
        pendingIceCandidates.current.set(senderSocketId, queue)
      }
    }

    const handleUserLeft = ({ socketId }: any) => {
      console.log(`👤 User Left Signaling Clean Up: ${socketId}`)
      
      peerMap.current.get(socketId)?.close()
      peerMap.current.delete(socketId)
      remoteStreams.current.delete(socketId)
      pendingIceCandidates.current.delete(socketId)
      makingOffersSet.current.delete(socketId)
      ignoreOfferMap.current.delete(socketId)
      
      // FIXED: Uses structural peerId mapping condition correctly
      setRemotePeers((prev) => prev.filter((p) => p.peerId !== socketId))
    }

    const handleExistingUsers = async (users: any[]) => {
      for (const peer of users) {
        if (peer.socketId === socket.id) continue

        setRemotePeers((prev) => {
          if (prev.some((p) => p.peerId === peer.socketId)) return prev
          return [
            ...prev, 
            { 
              peerId: peer.socketId, 
              name: peer.name, 
              stream: null,
              micOn: peer.micOn ?? true,
              cameraOn: peer.cameraOn ?? true
            }
          ]
        })

        const pc = createPeer(peer.socketId)

await new Promise(resolve => setTimeout(resolve, 100))

await makeOffer(pc, peer.socketId)

      }
    }

    const handleForceMute = () => {
      const audioTrack = localStreamRef.current?.getAudioTracks()[0]
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

    init()

    return () => {
      mounted = false

      socket.off("room-update", handleRoomUpdate)
      socket.off("existing-users", handleExistingUsers)
      socket.off("user-joined", handleUserJoined)
      socket.off("webrtc-offer", handleOffer)
      socket.off("webrtc-answer", handleAnswer)
      socket.off("webrtc-ice-candidate", handleIce)
      socket.off("user-left", handleUserLeft)
      socket.off("force-mute", handleForceMute)
    }
  }, [meetingId, user, socket, createPeer, makeOffer])


  /* ================= MEDIA CONTROL DRIVERS ================= */
  const replaceVideoTrack = useCallback(async (newTrack: MediaStreamTrack) => {
    const promises: Promise<void>[] = []
    peerMap.current.forEach((pc) => {
      const sender = pc.getSenders().find((s) => s.track?.kind === "video")
      if (sender) {
        promises.push(sender.replaceTrack(newTrack).catch(console.error))
      }
    })
    await Promise.all(promises)
  }, [])

  const stopScreenShare = useCallback(async () => {
    const cameraTrack = cameraTrackRef.current
    if (!cameraTrack) return

    await replaceVideoTrack(cameraTrack)
    const audioTrack = localStreamRef.current?.getAudioTracks()[0]
    const restoredStream = new MediaStream([cameraTrack, ...(audioTrack ? [audioTrack] : [])])

    localStreamRef.current = restoredStream
    setLocalStream(restoredStream)

    screenTrackRef.current?.stop()
    screenTrackRef.current = null
    setIsScreenSharing(false)
  }, [replaceVideoTrack])

  const startScreenShare = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
      const screenTrack = screenStream.getVideoTracks()[0]
      if (!screenTrack) return

      screenTrackRef.current = screenTrack
      const audioTrack = localStreamRef.current?.getAudioTracks()[0]
      const newStream = new MediaStream([screenTrack, ...(audioTrack ? [audioTrack] : [])])

      localStreamRef.current = newStream
      setLocalStream(newStream)

      await replaceVideoTrack(screenTrack)
      setIsScreenSharing(true)

      screenTrack.onended = () => {
        stopScreenShare()
      }
    } catch (err) {
      console.error(err)
    }
  }, [replaceVideoTrack, stopScreenShare])

  const toggleScreenShare = useCallback(() => {
    if (isScreenSharing) {
      stopScreenShare()
    } else {
      startScreenShare()
    }
  }, [isScreenSharing, startScreenShare, stopScreenShare])

  const toggleMic = useCallback(() => {
    const track = localStreamRef.current?.getAudioTracks()[0]
    if (!track) return

    track.enabled = !track.enabled
    setMicOn(track.enabled)
    lastMediaState.current.micOn = track.enabled

    socket?.emit("media-state", {
      micOn: track.enabled,
      cameraOn: lastMediaState.current.cameraOn,
    })
  }, [socket])

  const toggleCamera = useCallback(async () => {
    const track = localStreamRef.current?.getVideoTracks()[0]
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
    remoteStreams.current.clear()
    makingOffersSet.current.clear()
    ignoreOfferMap.current.clear()

    socket?.emit("leaveMeeting", { meetingId })
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