import { useState } from 'react';
import { Check, Clock, Search, UserPlus, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar';
import { Badge } from '#/components/ui/badge';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '#/components/ui/tabs';
import { useUsers } from '#/hooks/useAuth';
import { useConnections } from '#/hooks/useConnections';
import { useAuthStore } from '#/stores/authStore';
import type { User } from '#/types';

interface ConnectionsModalProps {
  onClose: () => void;
}

export function ConnectionsModal({ onClose }: ConnectionsModalProps) {
  const { user } = useAuthStore();
  const isDoctor = user?.role === 'DOCTOR';
  const { data: allUsers } = useUsers();
  const {
    connections,
    connectionRequests,
    outgoingRequests,
    sendConnectionRequest,
    acceptConnection,
    rejectConnection,
    isSendingRequest,
    isAcceptingConnection,
    isRejectingConnection,
  } = useConnections();

  const [activeTab, setActiveTab] = useState('find');
  const [searchQuery, setSearchQuery] = useState('');

  const connectedIds = new Set(connections.map((c) => c._id));
  const incomingIds = new Set(connectionRequests.map((c) => c._id));
  const outgoingIds = new Set(outgoingRequests.map((c) => c._id));

  const query = searchQuery.trim().toLowerCase();
  const candidates = (allUsers ?? []).filter((candidate) => {
    if (candidate._id === user?._id) return false;
    if (candidate.role !== (isDoctor ? 'PATIENT' : 'DOCTOR')) return false;
    if (connectedIds.has(candidate._id)) return false;
    if (outgoingIds.has(candidate._id)) return false;
    if (!query) return true;
    return `${candidate.firstName} ${candidate.lastName} ${candidate.username} ${candidate.email}`
      .toLowerCase()
      .includes(query);
  });

  const busy =
    isSendingRequest || isAcceptingConnection || isRejectingConnection;

  const handleConnect = (candidate: User) => {
    if (incomingIds.has(candidate._id)) {
      acceptConnection(candidate._id);
    } else {
      sendConnectionRequest(candidate._id);
    }
  };

  const renderUser = (
    candidate: User,
    action: 'connect' | 'accept' | 'pending' | 'connected'
  ) => (
    <div
      key={candidate._id}
      className="flex items-center gap-4 rounded-md border border-slate-200 px-4 py-3 dark:border-slate-700"
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={candidate.profilePicture} alt={candidate.username} />
        <AvatarFallback className="bg-primary/15 text-primary">
          {candidate.firstName[0]}
          {candidate.lastName[0]}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-slate-800 dark:text-white">
          {candidate.firstName} {candidate.lastName}
        </p>
        <p className="truncate text-sm text-slate-500 dark:text-slate-400">
          @{candidate.username}
        </p>
      </div>

      {action === 'connect' && (
        <Button
          size="sm"
          onClick={() => handleConnect(candidate)}
          disabled={busy}
        >
          <UserPlus className="mr-1 h-4 w-4" />
          Connect
        </Button>
      )}

      {action === 'accept' && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleConnect(candidate)}
          disabled={busy}
          className="text-green-600"
        >
          <Check className="mr-1 h-4 w-4" />
          Accept
        </Button>
      )}

      {action === 'pending' && (
        <Badge variant="secondary">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      )}

      {action === 'connected' && (
        <Badge variant="secondary">
          <Check className="mr-1 h-3 w-3" />
          Connected
        </Badge>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-md">
      <div className="relative flex max-h-[85vh] w-full max-w-xl flex-col rounded-lg bg-white p-6 shadow-md dark:bg-slate-900">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-500 transition-colors hover:text-red-500 dark:text-slate-400"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-4 text-xl font-semibold text-slate-800 dark:text-white">
          Connections
        </h2>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="find">Find People</TabsTrigger>
            <TabsTrigger value="requests">
              Requests
              {connectionRequests.length > 0 && (
                <span className="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-700">
                  {connectionRequests.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="find" className="mt-4">
            <div className="relative mb-4">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by name, username or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="max-h-[50vh] space-y-2 overflow-y-auto">
              {candidates.length > 0 ? (
                candidates.map((candidate) =>
                  renderUser(
                    candidate,
                    incomingIds.has(candidate._id) ? 'accept' : 'connect'
                  )
                )
              ) : (
                <p className="py-8 text-center text-slate-500">
                  No one found
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="requests" className="mt-4">
            <div className="max-h-[50vh] space-y-3 overflow-y-auto">
              <h3 className="text-sm font-semibold text-slate-500 uppercase">
                Incoming
              </h3>

              {connectionRequests.length > 0 ? (
                <div className="space-y-2">
                  {connectionRequests.map((request) => (
                    <div
                      key={request._id}
                      className="flex items-center gap-4 rounded-md border border-slate-200 px-4 py-3 dark:border-slate-700"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={request.profilePicture}
                          alt={request.username}
                        />
                        <AvatarFallback className="bg-primary/15 text-primary">
                          {request.firstName[0]}
                          {request.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-slate-800 dark:text-white">
                          {request.firstName} {request.lastName}
                        </p>
                        <p className="truncate text-sm text-slate-500">
                          @{request.username}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => acceptConnection(request._id)}
                        disabled={busy}
                        className="text-white"
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => rejectConnection(request._id)}
                        disabled={busy}
                      >
                        <X className="h-4 w-4 text-danger-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-4 text-center text-sm text-slate-500">
                  No incoming requests
                </p>
              )}

              <h3 className="pt-4 text-sm font-semibold text-slate-500 uppercase">
                Outgoing
              </h3>

              {outgoingRequests.length > 0 ? (
                <div className="space-y-2">
                  {outgoingRequests.map((request) =>
                    renderUser(request, 'pending')
                  )}
                </div>
              ) : (
                <p className="py-4 text-center text-sm text-slate-500">
                  No outgoing requests
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
