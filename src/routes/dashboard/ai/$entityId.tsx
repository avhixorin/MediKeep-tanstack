import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, FileText, Send, ShieldCheck, Sparkles } from 'lucide-react';
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
  const entity = (isDoctor ? user.patients : user?.doctors)?.find((e) => e._id === entityId);

  const { messages, isLoadingHistory, send, isStreaming, progressLabel, error } = useAiChat({ target: entityId });
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, progressLabel]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input]);

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
          <div className="relative shrink-0">
            <Avatar className="size-9">
              <AvatarImage src={entity?.profilePicture} alt={entity?.firstName} />
              <AvatarFallback className="bg-primary-100 text-primary-600">
                {entity?.firstName[0]}
                {entity?.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 h-4.5 w-4.5 rounded-full bg-linear-to-br from-primary-500 to-purple-500 flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
              <Sparkles className="h-2.5 w-2.5 text-white" />
            </div>
          </div>
          <div className="min-w-0">
            <h1 className="font-semibold text-slate-900 dark:text-white truncate">Ask AI</h1>
            <p className="text-xs text-slate-500 truncate">
              About records shared with {isDoctor ? '' : 'Dr. '}
              {entity ? `${entity.firstName} ${entity.lastName}` : 'this connection'}
            </p>
          </div>
          <Badge variant="outline" className="ml-auto hidden sm:flex items-center gap-1 text-xs text-slate-500 shrink-0">
            <ShieldCheck className="h-3 w-3" />
            Grounded in your records
          </Badge>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoadingHistory ? (
            <div className="space-y-3 max-w-2xl mx-auto pt-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className={cn('flex', i % 2 ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn(
                      'h-10 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse',
                      i % 2 ? 'w-40' : 'w-56'
                    )}
                  />
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-primary-500 to-purple-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Sparkles className="h-7 w-7 text-white" />
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
                    className="px-3 py-1.5 rounded-full text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-primary-400 hover:text-primary-600 hover:shadow-sm transition-all"
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
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary-500 to-purple-500 flex items-center justify-center shrink-0">
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <div>
                        <div
                          className={cn(
                            'rounded-2xl px-4 py-2.5',
                            isMe
                              ? 'bg-primary text-primary-foreground rounded-br-none'
                              : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-bl-none shadow-sm border border-slate-100 dark:border-slate-800'
                          )}
                        >
                          <p className="text-sm whitespace-pre-wrap wrap-break-word leading-relaxed">
                            {message.content}
                          </p>
                        </div>
                        {message.citations && message.citations.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400 mr-0.5">
                              Sources
                            </span>
                            {message.citations.map((citation) => (
                              <Link key={citation.recordId} to="/dashboard/records/$entityId" params={{ entityId }}>
                                <Badge
                                  variant="outline"
                                  className="gap-1 text-xs hover:border-primary-400 hover:text-primary-600 transition-colors"
                                >
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
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
              <div className="flex items-center gap-2.5 rounded-2xl rounded-bl-none bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 pl-1.5 pr-4 py-1.5">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary-500 to-purple-500 flex items-center justify-center shrink-0">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-bounce" />
                </span>
                <span className="text-sm text-slate-500">{progressLabel || 'Thinking...'}</span>
              </div>
            </motion.div>
          )}

          {error && (
            <div className="text-center text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg py-2 px-3">
              {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="bg-white dark:bg-slate-900 border-t p-4 shrink-0">
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask about these records..."
              disabled={isStreaming}
              className="flex-1 max-h-30 resize-none py-2.5 px-4 rounded-2xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60 text-sm leading-relaxed"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isStreaming}
              className="h-10 w-10 shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 transition-opacity"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 px-1">Press Enter to send, Shift+Enter for a new line.</p>
        </div>
      </div>
    </DashboardShell>
  );
}
