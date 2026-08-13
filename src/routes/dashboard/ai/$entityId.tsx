import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, FileText, Loader2, Send, Sparkles } from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAiChat } from '@/hooks';
import { useAuthStore } from '@/stores';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types';

export const Route = createFileRoute('/dashboard/ai/$entityId')({
  component: AskAiPage,
});

const SUGGESTED_QUESTIONS = [
  'Summarize my records',
  'What medicines were prescribed?',
  'Compare my last two reports',
  'What was my latest blood report?',
];

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  PRESCRIPTION: 'Prescription',
  BLOOD_REPORT: 'Blood Report',
  ECG_REPORT: 'ECG Report',
  XRAY_REPORT: 'X-Ray Report',
  OTHER: 'Other',
};

function AskAiPage() {
  const { entityId } = Route.useParams();
  const { user } = useAuthStore();
  const isDoctor = user?.role === UserRole.DOCTOR;
  const entity = (isDoctor ? user?.patients : user?.doctors)?.find((e) => e._id === entityId);

  const { messages, isLoadingHistory, send, isStreaming, progressLabel, error } = useAiChat({ target: entityId });
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, progressLabel]);

  const handleSend = (text?: string) => {
    const message = (text ?? input).trim();
    if (!message || isStreaming) return;
    send(message);
    setInput('');
  };

  return (
    <DashboardShell className="p-0 lg:p-0">
      <div className="flex h-[calc(100vh-4rem)] lg:h-[calc(100vh-8rem)] flex-col bg-slate-50 dark:bg-slate-950">
        <div className="h-16 bg-white dark:bg-slate-900 border-b px-4 flex items-center gap-3 shrink-0">
          <Link
            to="/dashboard/records/$entityId"
            params={{ entityId }}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-5 w-5 text-slate-500" />
          </Link>
          <Avatar className="size-9">
            <AvatarImage src={entity?.profilePicture} alt={entity?.firstName} />
            <AvatarFallback className="bg-primary-100 text-primary-600">
              {entity?.firstName?.[0]}
              {entity?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary-600" />
              Ask AI
            </h1>
            <p className="text-xs text-slate-500">
              About records shared with {isDoctor ? '' : 'Dr. '}
              {entity ? `${entity.firstName} ${entity.lastName}` : 'this connection'}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoadingHistory ? (
            <div className="flex justify-center pt-12 text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <Sparkles className="h-7 w-7 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Ask about these records</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-sm">
                  Ask AI only answers from records you're authorized to see, and says so plainly if it
                  can't find enough information.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 max-w-md">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="px-3 py-1.5 rounded-full text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-primary-400 hover:text-primary-600 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((message, index) => {
                const isMe = message.role === 'user';
                return (
                  <motion.div
                    key={message._id ?? `${index}-${message.content.slice(0, 20)}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn('flex', isMe ? 'justify-end' : 'justify-start')}
                  >
                    <div className={cn('flex items-end gap-2 max-w-[75%]', isMe && 'flex-row-reverse')}>
                      {!isMe && (
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                          <Sparkles className="h-4 w-4 text-primary-600" />
                        </div>
                      )}
                      <div>
                        <div
                          className={cn(
                            'rounded-2xl px-4 py-2',
                            isMe
                              ? 'bg-primary text-primary-foreground rounded-br-none'
                              : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-bl-none shadow-sm'
                          )}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                        </div>
                        {message.citations && message.citations.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {message.citations.map((citation) => (
                              <Link
                                key={citation.recordId}
                                to="/dashboard/records/$entityId"
                                params={{ entityId }}
                              >
                                <Badge variant="outline" className="gap-1 text-xs hover:border-primary-400">
                                  <FileText className="h-3 w-3" />
                                  {DOCUMENT_TYPE_LABELS[citation.documentType] || citation.documentType}
                                  {citation.fileName ? ` · ${citation.fileName}` : ''}
                                </Badge>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}

          {isStreaming && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl rounded-bl-none bg-white dark:bg-slate-900 shadow-sm px-4 py-2.5">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary-600" />
                <span className="text-sm text-slate-500">{progressLabel || 'Thinking...'}</span>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg py-2 px-3">
              {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="bg-white dark:bg-slate-900 border-t p-4 shrink-0">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about these records..."
              disabled={isStreaming}
              className="flex-1 h-10 px-4 rounded-full border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isStreaming}
              className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 transition-opacity"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
