import { DashboardShell } from '#/components/layout';
import { ConnectionsModal } from '#/components/chat/connections-modal';
import { useVideoCall } from '#/components/video-call/video-call-context';
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar';
import { Badge } from '#/components/ui/badge';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { useSocketEmitters, useConnections } from '#/hooks';
import { useAuthStore } from '#/stores/authStore';
import { useChatStore } from '#/stores/chatStore';
import { createFileRoute } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCheck, ImageIcon, MessageSquare, MoreVertical, Paperclip, Phone, Search, Send, Smile, UserPlus, Video } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export const Route = createFileRoute('/dashboard/chat/')({
  component: ChatPage,
})

function ChatPage() {
  const { user } = useAuthStore();
  const { conversations: storeConversations, activeConversationId, setActiveConversation, markAsRead, onlineUsers } = useChatStore();
  const { sendMessage } = useSocketEmitters();
  const { conversations, connectionRequests, isLoading } = useConnections();
  const { startCall } = useVideoCall();

  const [isConnectionsOpen, setIsConnectionsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync conversations fetched over REST into the chat store so live socket
  // messages can be appended to them.
  useEffect(() => {
    const { conversations: existing, setConversations: setExisting } =
      useChatStore.getState();

    const merged = conversations.map((conv) => {
      const current = existing.find((c) => c.friendId === conv.friendId);
      if (!current) return conv;
      return {
        ...current,
        chatHistory:
          current.chatHistory.length >= conv.chatHistory.length
            ? current.chatHistory
            : conv.chatHistory,
        friend: current.friend ?? conv.friend,
      };
    });

    const mergedIds = new Set(merged.map((c) => c.friendId));
    const extras = existing.filter((c) => !mergedIds.has(c.friendId));
    const next = [...merged, ...extras];

    const hasChanged =
      next.length !== existing.length ||
      next.some((conv, i) => {
        const current = existing[i];
        return (
          current.friendId !== conv.friendId ||
          current.chatHistory.length !== conv.chatHistory.length ||
          current.chatHistory[current.chatHistory.length - 1]?.messageId !==
            conv.chatHistory[conv.chatHistory.length - 1]?.messageId
        );
      });

    if (hasChanged) {
      setExisting(next);
    }
  }, [conversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [storeConversations, activeConversationId]);

  const activeConversation = storeConversations.find(c => c.friendId === activeConversationId);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeConversationId || !user) return;

    const messageId = Date.now().toString();
    const message = messageInput.trim();

    sendMessage(user._id, activeConversationId, message, messageId);

    // Optimistically append the message so it appears instantly; the backend
    // stores the same client-provided messageId, so it stays consistent with
    // the history loaded on refresh.
    useChatStore
      .getState()
      .addMessage(activeConversationId, {
        messageId,
        message,
        sender: user._id,
        timestamp: new Date().toISOString(),
      });

    setMessageInput('');
  };

  const handleSelectConversation = (friendId: string) => {
    setActiveConversation(friendId);
    markAsRead(friendId);
  };

  const filteredConversations = storeConversations.filter(conv =>
    `${conv.friend?.firstName} ${conv.friend?.lastName} ${conv.friend?.username}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const isOnline = (userId: string) => onlineUsers.includes(userId);

  return (
    <DashboardShell className="p-0 lg:p-0">
      <div className="flex h-[calc(100vh-4rem)] lg:h-[calc(100vh-8rem)]">
        <div className="w-full md:w-80 lg:w-96 border-r bg-background flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Messages</h2>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsConnectionsOpen(true)}
                aria-label="Connections"
              >
                <UserPlus className="h-5 w-5 text-primary" />
                {connectionRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
                    {connectionRequests.length}
                  </span>
                )}
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500">
                <p>Loading conversations...</p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p>No conversations yet</p>
                <p className="text-sm mt-1 mb-4">Connect with doctors or patients to start chatting</p>
                <Button size="sm" onClick={() => setIsConnectionsOpen(true)}>
                  <UserPlus className="mr-1 h-4 w-4" />
                  Find People
                </Button>
              </div>
            ) : (
              <div className="divide-y">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.friendId}
                    onClick={() => handleSelectConversation(conv.friendId)}
                    className={`w-full p-4 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors relative ${
                      activeConversationId === conv.friendId ? 'bg-primary/10 dark:bg-primary/15' : ''
                    }`}
                  >
                    <div className="relative shrink-0">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={conv.friend?.profilePicture} alt={conv.friend?.firstName} />
                        <AvatarFallback className="bg-primary/15 text-primary">
                          {conv.friend?.firstName[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${isOnline(conv.friendId) ? 'bg-green-500' : 'bg-slate-400'}`} />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                          {`${conv.friend?.firstName ?? ''} ${conv.friend?.lastName ?? ''}`.trim() || 'Unknown'}
                        </h3>
                        {(conv.unreadCount ?? 0) > 0 && (
                          <Badge variant="default" className="ml-2">{conv.unreadCount}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                        {conv.chatHistory[conv.chatHistory.length - 1]?.message || 'No messages yet'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        {activeConversation ? (
          <div className="hidden md:flex flex-1 flex-col bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <div className="h-16 bg-white dark:bg-slate-900 border-b px-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={activeConversation.friend?.profilePicture} />
                  <AvatarFallback className="bg-primary/15 text-primary">
                    {activeConversation.friend?.firstName[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {`${activeConversation.friend?.firstName ?? ''} ${activeConversation.friend?.lastName ?? ''}`.trim() || 'Unknown'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isOnline(activeConversation.friendId) ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (activeConversation.friend) {
                      startCall(activeConversation.friendId, activeConversation.friend, true);
                    }
                  }}
                  aria-label="Start audio call"
                >
                  <Phone className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary"
                  onClick={() => {
                    if (activeConversation.friend) {
                      startCall(activeConversation.friendId, activeConversation.friend, false);
                    }
                  }}
                  aria-label="Start video call"
                >
                  <Video className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {activeConversation.chatHistory.map((message, index) => {
                  const isMe = message.sender === user?._id;
                  const showAvatar = index === 0 ||
                    activeConversation.chatHistory[index - 1]?.sender !== message.sender;

                  return (
                    <motion.div
                      key={message.messageId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-end gap-2 max-w-[70%] ${isMe ? 'flex-row-reverse' : ''}`}>
                        {showAvatar && !isMe && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/15 text-primary text-xs">
                    {activeConversation.friend?.firstName[0] || 'U'}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className={`rounded-2xl px-4 py-2 ${
                          isMe
                            ? 'bg-primary text-primary-foreground rounded-br-none'
                            : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-bl-none shadow-sm'
                        }`}>
                          <p className="text-sm break-words">{message.message}</p>
                          <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : ''}`}>
                            {message.timestamp && (
                              <span className={`text-xs ${isMe ? 'text-primary-foreground/70' : 'text-slate-400'}`}>
                                {new Date(message.timestamp).toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                })}
                              </span>
                            )}
                            {isMe && (
                              <CheckCheck className="h-3 w-3 text-primary-foreground/70" />
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            <div className="bg-white dark:bg-slate-900 border-t p-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-5 w-5 text-slate-500" />
                </Button>
                <Button variant="ghost" size="icon">
                  <ImageIcon className="h-5 w-5 text-slate-500" />
                </Button>
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 h-10 px-4 rounded-full border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button variant="ghost" size="icon">
                  <Smile className="h-5 w-5 text-slate-500" />
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  size="icon"
                  className="rounded-full"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-slate-50 dark:bg-slate-950">
            <div className="text-center text-slate-500">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Select a conversation</h3>
              <p className="text-sm">Choose a conversation from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>

      {isConnectionsOpen && <ConnectionsModal onClose={() => setIsConnectionsOpen(false)} />}
    </DashboardShell>
  );
}
