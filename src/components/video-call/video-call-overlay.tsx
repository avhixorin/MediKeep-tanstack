import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Video,
  VideoOff,
  X,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar';
import { Button } from '#/components/ui/button';
import { cn } from '#/lib/utils';
import { useVideoCall } from './video-call-context';

function VideoElement({
  stream,
  muted = false,
  className,
}: {
  stream: MediaStream | null;
  muted?: boolean;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!stream) return null;

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={muted}
      className={cn('h-full w-full object-cover', className)}
    />
  );
}

function CallAvatar({ name, src }: { name: string; src?: string }) {
  return (
    <Avatar className="h-28 w-28 border-4 border-white/20 shadow-xl">
      <AvatarImage src={src} alt={name} />
      <AvatarFallback className="bg-primary/15 text-primary text-4xl">
        {name[0] || 'U'}
      </AvatarFallback>
    </Avatar>
  );
}

export function VideoCallOverlay() {
  const {
    localStream,
    remoteStream,
    callState,
    isMuted,
    isVideoOff,
    acceptCall,
    declineCall,
    endCall,
    toggleMute,
    toggleVideo,
  } = useVideoCall();

  const [callTimer, setCallTimer] = useState(0);

  const other = callState.isIncomingCall
    ? callState.caller
    : callState.callee;
  const name =
    other && `${other.firstName} ${other.lastName}`.trim()
      ? `${other.firstName} ${other.lastName}`.trim()
      : other?.username || 'Unknown';
  const picture = other?.profilePicture;

  const inCall =
    callState.isInCall &&
    (callState.callStatus === 'connecting' ||
      callState.callStatus === 'connected');

  // Timer for active calls
  useEffect(() => {
    if (callState.callStatus !== 'connected') {
      setCallTimer(0);
      return;
    }
    const interval = setInterval(() => setCallTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [callState.callStatus]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const statusLabel =
    callState.callStatus === 'ringing'
      ? 'Incoming call'
      : callState.callStatus === 'calling'
        ? 'Calling...'
        : callState.callStatus === 'connecting'
          ? 'Connecting...'
          : callState.callStatus === 'connected'
            ? 'On call'
            : callState.callStatus === 'declined'
              ? 'Call declined'
              : 'Call ended';

  const shouldShow = callState.isInCall || callState.isIncomingCall;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          {inCall ? (
            <div className="relative h-full w-full max-w-5xl overflow-hidden rounded-2xl bg-slate-950">
              {/* Remote stream (or placeholder for audio-only calls) */}
              <div className="absolute inset-0 flex items-center justify-center">
                {remoteStream && !callState.audioOnly ? (
                  <VideoElement stream={remoteStream} />
                ) : (
                  <div className="flex flex-col items-center gap-4 text-center">
                    <CallAvatar name={name} src={picture} />
                    <div>
                      <h2 className="text-2xl font-semibold text-white">{name}</h2>
                      <p className="text-white/70">{statusLabel}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Local preview */}
              <div className="absolute right-4 top-4 h-40 w-28 overflow-hidden rounded-xl border border-white/20 bg-slate-900 shadow-lg">
                {localStream ? (
                  <VideoElement
                    stream={localStream}
                    muted
                    className={cn(isVideoOff && 'hidden')}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-white/50">
                    <VideoOff className="h-6 w-6" />
                  </div>
                )}
              </div>

              {/* Header */}
              <div className="absolute left-0 right-0 top-0 flex items-center justify-center gap-2 bg-linear-to-b from-black/60 to-transparent p-4">
                <h2 className="text-lg font-semibold text-white">{name}</h2>
                <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white tabular-nums">
                  {formatTime(callTimer)}
                </span>
              </div>

              {/* Controls */}
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-3 bg-linear-to-t from-black/60 to-transparent p-6">
                <Button
                  variant="secondary"
                  size="icon-lg"
                  onClick={toggleMute}
                  className={cn(
                    'rounded-full',
                    isMuted && 'bg-red-500 text-white hover:bg-red-600'
                  )}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                {!callState.audioOnly && (
                  <Button
                    variant="secondary"
                    size="icon-lg"
                    onClick={toggleVideo}
                    className={cn(
                      'rounded-full',
                      isVideoOff && 'bg-red-500 text-white hover:bg-red-600'
                    )}
                    aria-label={isVideoOff ? 'Turn video on' : 'Turn video off'}
                  >
                    {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="icon-lg"
                  onClick={endCall}
                  className="rounded-full h-14 w-14"
                  aria-label="End call"
                >
                  <PhoneOff className="h-6 w-6" />
                </Button>
              </div>
            </div>
          ) : (
            /* Incoming / outgoing pre-call screen */
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl bg-background p-8 shadow-2xl"
            >
              <div className="flex flex-col items-center gap-5 text-center">
                <CallAvatar name={name} src={picture} />
                <div>
                  <h2 className="text-2xl font-semibold">{name}</h2>
                  <p className="text-muted-foreground">{statusLabel}</p>
                </div>

                {callState.isIncomingCall ? (
                  <div className="flex items-center gap-6">
                    <Button
                      variant="destructive"
                      size="icon-lg"
                      onClick={declineCall}
                      className="rounded-full h-14 w-14"
                      aria-label="Decline call"
                    >
                      <PhoneOff className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="default"
                      size="icon-lg"
                      onClick={acceptCall}
                      className="rounded-full h-14 w-14 bg-green-500 hover:bg-green-600"
                      aria-label="Accept call"
                    >
                      <Phone className="h-6 w-6" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-6">
                    <Button
                      variant="secondary"
                      size="icon-lg"
                      onClick={declineCall}
                      className="rounded-full h-14 w-14"
                      aria-label="Cancel call"
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
