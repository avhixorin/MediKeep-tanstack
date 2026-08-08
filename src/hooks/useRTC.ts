import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useSocket } from './useSocket';
import { SOCKET_EVENTS } from '@/constants/socketEvents';
import type { User } from '@/types';
import { toast } from 'sonner';

interface VideoCallState {
  isInCall: boolean;
  isIncomingCall: boolean;
  caller: User | null;
  callee: User | null;
  roomId: string | null;
  callStatus: 'idle' | 'calling' | 'ringing' | 'connected' | 'ended' | 'declined';
}

export function useRTC() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [callState, setCallState] = useState<VideoCallState>({
    isInCall: false,
    isIncomingCall: false,
    caller: null,
    callee: null,
    roomId: null,
    callStatus: 'idle',
  });
  
  const [constraints, setConstraints] = useState<MediaStreamConstraints>({
    audio: true,
    video: { width: 1280, height: 720 },
  });

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const { socket, on, off } = useSocket();

  const servers = useMemo(
    () => ({
      iceServers: [
        {
          urls: [
            'stun:stun1.l.google.com:19302',
            'stun:stun2.l.google.com:19302',
          ],
        },
      ],
    }),
    []
  );

  const grabLocalMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast.error('Could not access your camera and microphone. Please check permissions.');
      throw error;
    }
  }, [constraints]);

  const createPeerConnection = useCallback(
    async (to: string) => {
      const peerConnection = new RTCPeerConnection(servers);
      
      peerConnection.ontrack = (event) => {
        setRemoteStream((prevStream) => {
          const updatedStream = prevStream || new MediaStream();
          event.streams[0].getTracks().forEach((track) => {
            if (!updatedStream.getTracks().some((t) => t.kind === track.kind)) {
              updatedStream.addTrack(track);
            }
          });
          return updatedStream;
        });
      };

      let stream = localStream;
      if (!stream) {
        stream = await grabLocalMedia();
      }

      stream?.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream!);
      });

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket?.emit(SOCKET_EVENTS.RTC_EVENT, {
            type: 'candidate',
            candidate: event.candidate,
            to,
          });
        }
      };

      peerConnection.onconnectionstatechange = () => {
        if (peerConnection.connectionState === 'connected') {
          setCallState((prev) => ({ ...prev, callStatus: 'connected' }));
        } else if (peerConnection.connectionState === 'disconnected' || 
                   peerConnection.connectionState === 'failed' ||
                   peerConnection.connectionState === 'closed') {
          setCallState((prev) => ({ ...prev, callStatus: 'ended' }));
        }
      };

      peerConnectionRef.current = peerConnection;
      return peerConnection;
    },
    [localStream, grabLocalMedia, socket, servers]
  );

  const createOffer = useCallback(
    async (to: string, callee: User) => {
      try {
        const peerConnection = await createPeerConnection(to);
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        
        socket?.emit(SOCKET_EVENTS.RTC_EVENT, {
          type: 'offer',
          offer,
          to,
        });

        socket?.emit(SOCKET_EVENTS.VIDEO_CALL_REQUEST, { to });
        
        setCallState({
          isInCall: true,
          isIncomingCall: false,
          caller: null,
          callee,
          roomId: to,
          callStatus: 'calling',
        });
      } catch (error) {
        console.error('Error creating offer:', error);
        toast.error('Failed to initiate call');
      }
    },
    [createPeerConnection, socket]
  );

  const createAnswer = useCallback(
    async (offer: RTCSessionDescriptionInit, from: string) => {
      try {
        const peerConnection = await createPeerConnection(from);
        await peerConnection.setRemoteDescription(offer);
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        
        socket?.emit(SOCKET_EVENTS.RTC_EVENT, {
          type: 'answer',
          answer,
          to: from,
        });

        setCallState((prev) => ({
          ...prev,
          isInCall: true,
          isIncomingCall: false,
          callStatus: 'connected',
        }));
      } catch (error) {
        console.error('Error creating answer:', error);
        toast.error('Failed to accept call');
      }
    },
    [createPeerConnection, socket]
  );

  const addAnswer = useCallback(async (answer: RTCSessionDescriptionInit) => {
    try {
      if (peerConnectionRef.current && !peerConnectionRef.current.currentRemoteDescription) {
        await peerConnectionRef.current.setRemoteDescription(answer);
      }
    } catch (error) {
      console.error('Error adding answer:', error);
    }
  }, []);

  const handleIncomingCall = useCallback((caller: User) => {
    setCallState({
      isInCall: false,
      isIncomingCall: true,
      caller,
      callee: null,
      roomId: caller._id,
      callStatus: 'ringing',
    });
    
    // Play ringtone
    const audio = new Audio('/sounds/ringtone.mp3');
    audio.loop = true;
    audio.play().catch(console.error);
  }, []);

  const acceptCall = useCallback(async () => {
    if (!callState.caller) return;
    
    socket?.emit(SOCKET_EVENTS.VIDEO_CALL_RESPONSE, {
      to: callState.caller._id,
      verdict: 'accepted',
    });

    // Wait for the offer from the caller via RTC_EVENT
  }, [callState.caller, socket]);

  const declineCall = useCallback(() => {
    if (callState.caller) {
      socket?.emit(SOCKET_EVENTS.VIDEO_CALL_RESPONSE, {
        to: callState.caller._id,
        verdict: 'rejected',
      });
    }
    
    setCallState({
      isInCall: false,
      isIncomingCall: false,
      caller: null,
      callee: null,
      roomId: null,
      callStatus: 'idle',
    });
  }, [callState.caller, socket]);

  const endCall = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    localStream?.getTracks().forEach((track) => track.stop());
    setLocalStream(null);
    setRemoteStream(null);
    
    setCallState({
      isInCall: false,
      isIncomingCall: false,
      caller: null,
      callee: null,
      roomId: null,
      callStatus: 'ended',
    });
  }, [localStream]);

  const toggleMute = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  }, [localStream]);

  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  }, [localStream]);

  // Handle socket events
  useEffect(() => {
    const handleVideoCallRequest = (data: { from: User }) => {
      handleIncomingCall(data.from);
    };

    const handleVideoCallResponse = (data: { from: User; verdict?: string }) => {
      if (data.verdict === 'rejected') {
        toast.error('Call declined');
        endCall();
      }
    };

    const handleRTCEvent = async (data: {
      type: string;
      offer?: RTCSessionDescriptionInit;
      answer?: RTCSessionDescriptionInit;
      candidate?: RTCIceCandidate;
      from?: string;
    }) => {
      switch (data.type) {
        case 'offer':
          if (data.offer && data.from) {
            await createAnswer(data.offer, data.from);
          }
          break;

        case 'answer':
          if (data.answer) {
            await addAnswer(data.answer);
            setCallState((prev) => ({ ...prev, callStatus: 'connected' }));
          }
          break;

        case 'candidate':
          if (peerConnectionRef.current && data.candidate) {
            try {
              await peerConnectionRef.current.addIceCandidate(data.candidate);
            } catch (error) {
              console.error('Error adding ICE candidate:', error);
            }
          }
          break;

        default:
          console.log(`Unhandled RTC event type: ${data.type}`);
      }
    };

    on(SOCKET_EVENTS.VIDEO_CALL_REQUEST, handleVideoCallRequest);
    on(SOCKET_EVENTS.VIDEO_CALL_RESPONSE, handleVideoCallResponse);
    on(SOCKET_EVENTS.RTC_EVENT, handleRTCEvent);

    return () => {
      off(SOCKET_EVENTS.VIDEO_CALL_REQUEST, handleVideoCallRequest);
      off(SOCKET_EVENTS.VIDEO_CALL_RESPONSE, handleVideoCallResponse);
      off(SOCKET_EVENTS.RTC_EVENT, handleRTCEvent);
    };
  }, [on, off, handleIncomingCall, createAnswer, addAnswer, endCall]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      localStream?.getTracks().forEach((track) => track.stop());
    };
  }, [localStream]);

  return {
    localStream,
    remoteStream,
    callState,
    isMuted,
    isVideoOff,
    createOffer,
    acceptCall,
    declineCall,
    endCall,
    toggleMute,
    toggleVideo,
    grabLocalMedia,
    setConstraints,
  };
}
