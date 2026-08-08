import { createFileRoute } from '@tanstack/react-router';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Send, 
  Paperclip, 
  Phone, 
  Video, 
  MoreVertical,
  Smile,
  Image as ImageIcon,
  CheckCheck,
  MessageSquare,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuthStore, useChatStore } from '@/stores';
import { useSocketEmitters } from '@/hooks';
import { motion, AnimatePresence } from 'framer-motion';

export const Route = createFileRoute('/dashboard/chat')({
  component: ChatPage,
});

function ChatPage() {
  const { user } = useAuthStore();
  const { conversations, activeConversationId, setActiveConversation } = useChatStore();
  const { sendMessage } = useSocketEmitters();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, activeConversationId]);

  const activeConversation = conversations.find(c => c.friendId === activeConversationId);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeConversationId || !user) return;
    
    sendMessage(
      user._id,
      activeConversationId,
      messageInput.trim(),
      Date.now().toString()
    );
    
    setMessageInput('');
  };

  const filteredConversations = conversations.filter(conv =>
    conv.friend?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.friend?.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardShell className="p-0 lg:p-0">
      <div className="flex h-[calc(100vh-4rem)] lg:h-[calc(100vh-8rem)]">
        <div className="w-full md:w-80 lg:w-96 border-r bg-background flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Messages</h2>
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
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p>No conversations yet</p>
                <p className="text-sm mt-1">Connect with doctors or patients to start chatting</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.friendId}
                    onClick={() => setActiveConversation(conv.friendId)}
                    className={`w-full p-4 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors ${
                      activeConversationId === conv.friendId ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={conv.friend?.profilePicture} alt={conv.friend?.fullName} />
                        <AvatarFallback className="bg-primary-100 text-primary-600">
                          {conv.friend?.fullName[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                          {conv.friend?.fullName || 'Unknown'}
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
                  <AvatarFallback className="bg-primary-100 text-primary-600">
                    {activeConversation.friend?.fullName[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {activeConversation.friend?.fullName}
                  </h3>
                  <p className="text-xs text-slate-500">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-primary-600">
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
                            <AvatarFallback className="bg-primary-100 text-primary-600 text-xs">
                              {activeConversation.friend?.fullName[0] || 'U'}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className={`rounded-2xl px-4 py-2 ${
                          isMe 
                            ? 'bg-primary-600 text-white rounded-br-none' 
                            : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-bl-none shadow-sm'
                        }`}>
                          <p className="text-sm">{message.message}</p>
                          <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : ''}`}>
                            <span className={`text-xs ${isMe ? 'text-primary-200' : 'text-slate-400'}`}>
                              {message.timestamp}
                            </span>
                            {isMe && (
                              <CheckCheck className="h-3 w-3 text-primary-200" />
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
    </DashboardShell>
  );
}
