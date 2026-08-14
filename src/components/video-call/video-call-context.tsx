import { createContext, useContext } from 'react';
import { useRTC } from '#/hooks/useRTC';

export type VideoCallContextValue = ReturnType<typeof useRTC>;

const VideoCallContext = createContext<VideoCallContextValue | null>(null);

export function useVideoCall() {
  const context = useContext(VideoCallContext);
  if (!context) {
    throw new Error('useVideoCall must be used within a VideoCallProvider');
  }
  return context;
}

export function VideoCallProvider({ children }: { children: React.ReactNode }) {
  const rtc = useRTC();
  return (
    <VideoCallContext.Provider value={rtc}>
      {children}
    </VideoCallContext.Provider>
  );
}