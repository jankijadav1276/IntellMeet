import { useEffect, useRef, useState, useCallback } from "react"
import { io, Socket } from "socket.io-client"
import useAuthStore from "../store/authStore"

// One entry in our remote peers map
interface RemotePeer {
  peerId: string        // socket id of the remote user
  name: string
  stream: MediaStream | null
}

interface UseWebRTCReturn {
  localStream: MediaStream | null      // your own camera/mic
  remotePeers: RemotePeer[]            // everyone else in the room
  micOn: boolean
  cameraOn: boolean
  toggleMic: () => void
  toggleCamera: () => void
  leaveCall: () => void
  isConnecting: boolean
  error: string | null
}

// STUN servers — these are free Google servers that help
// two browsers find each other across NAT/firewalls
const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
}

export function useWebRTC(meetingId: string | undefined): UseWebRTCReturn {
  const { token } = useAuthStore()

  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remotePeers, setRemotePeers] = useState<RemotePeer[]>([])
  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)
  const [isConnecting, setIsConnecting] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Refs so we can access latest values inside socket callbacks
  // without stale closure issues
  const socketRef = useRef<Socket | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map())

  // ── Helper: create a peer connection for one remote user ──────────────────
  const createPeerConnection = useCallback(
    (peerId: string,_peerName: string): RTCPeerConnection => {
      const pc = new RTCPeerConnection(ICE_SERVERS)

      // When we get ICE candidates, send them to the other peer via socket
      pc.onicecandidate = (event) => {
        if (event.candidate && socketRef.current) {
          socketRef.current.emit("webrtc:ice-candidate", {
            meetingId,
            targetId: peerId,
            candidate: event.candidate,
          })
        }
      }

      // When remote stream arrives, update state so VideoTile can render it
      pc.ontrack = (event) => {
        const [remoteStream] = event.streams
        setRemotePeers((prev) =>
          prev.map((p) =>
            p.peerId === peerId ? { ...p, stream: remoteStream } : p
          )
        )
      }

      // Add our local tracks to this connection so the remote can see/hear us
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current!)
        })
      }

      // Save to our map
      peerConnectionsRef.current.set(peerId, pc)
      return pc
    },
    [meetingId]
  )

  // ── Main effect: get camera then connect socket ───────────────────────────
  useEffect(() => {
    if (!meetingId || !token) return

    let cancelled = false

    async function init() {
      try {
        // Step 1 — ask browser for camera + mic
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }

        localStreamRef.current = stream
        setLocalStream(stream)
        setIsConnecting(false)

        // Step 2 — connect socket
        const socket = io(import.meta.env.VITE_SOCKET_URL, {
          auth: { token },
        })
        socketRef.current = socket

        // ── Socket events ─────────────────────────────────────────────────

        socket.on("connect", () => {
          // Join the meeting room
          socket.emit("join-room", { meetingId })
        })

        // Someone new joined — we initiate the offer to them
        socket.on(
          "user-joined",
          async ({ peerId, name }: { peerId: string; name: string }) => {
            // Add them to our list first (stream will fill in via ontrack)
            setRemotePeers((prev) => [
              ...prev,
              { peerId, name, stream: null },
            ])

            const pc = createPeerConnection(peerId, name)

            // Create and send offer
            const offer = await pc.createOffer()
            await pc.setLocalDescription(offer)

            socket.emit("webrtc:offer", {
              meetingId,
              targetId: peerId,
              offer,
            })
          }
        )

        // We received an offer from someone — send back an answer
        socket.on(
          "webrtc:offer",
          async ({
            senderId,
            senderName,
            offer,
          }: {
            senderId: string
            senderName: string
            offer: RTCSessionDescriptionInit
          }) => {
            setRemotePeers((prev) => {
              const exists = prev.find((p) => p.peerId === senderId)
              if (exists) return prev
              return [...prev, { peerId: senderId, name: senderName, stream: null }]
            })

            const pc = createPeerConnection(senderId, senderName)
            await pc.setRemoteDescription(new RTCSessionDescription(offer))

            const answer = await pc.createAnswer()
            await pc.setLocalDescription(answer)

            socket.emit("webrtc:answer", {
              meetingId,
              targetId: senderId,
              answer,
            })
          }
        )

        // We received an answer to our offer
        socket.on(
          "webrtc:answer",
          async ({
            senderId,
            answer,
          }: {
            senderId: string
            answer: RTCSessionDescriptionInit
          }) => {
            const pc = peerConnectionsRef.current.get(senderId)
            if (pc) {
              await pc.setRemoteDescription(new RTCSessionDescription(answer))
            }
          }
        )

        // ICE candidate from remote peer — add it to their connection
        socket.on(
          "webrtc:ice-candidate",
          async ({
            senderId,
            candidate,
          }: {
            senderId: string
            candidate: RTCIceCandidateInit
          }) => {
            const pc = peerConnectionsRef.current.get(senderId)
            if (pc) {
              await pc.addIceCandidate(new RTCIceCandidate(candidate))
            }
          }
        )

        // Someone left — clean up their peer connection
        socket.on("user-left", ({ peerId }: { peerId: string }) => {
          const pc = peerConnectionsRef.current.get(peerId)
          if (pc) {
            pc.close()
            peerConnectionsRef.current.delete(peerId)
          }
          setRemotePeers((prev) => prev.filter((p) => p.peerId !== peerId))
        })
      } catch (err) {
        if (!cancelled) {
          console.error("WebRTC init error:", err)
          setError(
            "Could not access camera or microphone. Please allow permissions and try again."
          )
          setIsConnecting(false)
        }
      }
    }

    init()

    // ── Cleanup when component unmounts or meetingId changes ─────────────
    return () => {
      cancelled = true

      // Stop all local tracks (turns off camera light)
      localStreamRef.current?.getTracks().forEach((t) => t.stop())

      // Close all peer connections
      peerConnectionsRef.current.forEach((pc) => pc.close())
      peerConnectionsRef.current.clear()

      // Leave room and disconnect socket
      if (socketRef.current) {
        socketRef.current.emit("leave-room", { meetingId })
        socketRef.current.disconnect()
      }
    }
  }, [meetingId, token, createPeerConnection])

  // ── Toggle mic ────────────────────────────────────────────────────────────
  const toggleMic = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setMicOn(audioTrack.enabled)
      }
    }
  }, [])

  // ── Toggle camera ─────────────────────────────────────────────────────────
  const toggleCamera = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setCameraOn(videoTrack.enabled)
      }
    }
  }, [])

  // ── Leave call ────────────────────────────────────────────────────────────
  const leaveCall = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop())
    peerConnectionsRef.current.forEach((pc) => pc.close())
    peerConnectionsRef.current.clear()
    if (socketRef.current) {
      socketRef.current.emit("leave-room", { meetingId })
      socketRef.current.disconnect()
    }
    setLocalStream(null)
    setRemotePeers([])
  }, [meetingId])

  return {
    localStream,
    remotePeers,
    micOn,
    cameraOn,
    toggleMic,
    toggleCamera,
    leaveCall,
    isConnecting,
    error,
  }
}