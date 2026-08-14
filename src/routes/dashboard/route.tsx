import { createFileRoute, Outlet } from '@tanstack/react-router';
import { VideoCallProvider } from '#/components/video-call/video-call-context';
import { VideoCallOverlay } from '#/components/video-call/video-call-overlay';

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <VideoCallProvider>
      <Outlet />
      <VideoCallOverlay />
    </VideoCallProvider>
  );
}