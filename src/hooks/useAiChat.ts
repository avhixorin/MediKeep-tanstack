import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import type { ApiResponse } from '@/types';

export interface AiCitation {
  recordId: string;
  fileName: string;
  documentType: string;
  documentDate?: string;
}

export interface AiChatMessage {
  _id?: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: AiCitation[];
  createdAt?: string;
}

// Maps the SSE progress stage to a user-facing label — never the
// underlying tool/agent name, and never any internal reasoning.
const PROGRESS_LABELS: Record<string, string> = {
  rewriting_query: 'Understanding your question...',
  classifying_intent: 'Analyzing your question...',
  searching_records: 'Searching authorized records...',
  reading_documents: 'Reading documents...',
  looking_up_connections: 'Looking up connections...',
  consulting_platform_knowledge: 'Checking platform help...',
  generating_answer: 'Generating response...',
};

const parseSseFrame = (frame: string): { event: string; data: string } | null => {
  let event = 'message';
  let data = '';
  for (const line of frame.split('\n')) {
    if (line.startsWith('event:')) event = line.slice(6).trim();
    else if (line.startsWith('data:')) data += line.slice(5).trim();
  }
  return data ? { event, data } : null;
};

interface UseAiChatParams {
  target?: string;
}

/**
 * Ask AI chat for one doctor-patient connection. Uses fetch + a manual
 * ReadableStream/SSE-frame parser rather than EventSource, since
 * EventSource can't send a POST body or credentials the way this needs.
 */
export function useAiChat({ target }: UseAiChatParams) {
  const historyQuery = useQuery({
    queryKey: ['aiChatHistory', target],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<{ messages: AiChatMessage[] }>>(
        '/users/ai/chat/history',
        { params: { target } }
      );
      return response.data.data?.messages ?? [];
    },
    enabled: !!target,
  });

  const [liveMessages, setLiveMessages] = useState<AiChatMessage[]>([]);
  const [progressStage, setProgressStage] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLiveMessages([]);
    setError(null);
  }, [target]);

  const send = useCallback(
    async (message: string) => {
      const trimmed = message.trim();
      if (!target || !trimmed || isStreaming) return;

      setError(null);
      setIsStreaming(true);
      setProgressStage(null);
      setLiveMessages((prev) => [...prev, { role: 'user', content: trimmed }]);

      try {
        const response = await fetch(`${apiClient.defaults.baseURL}/users/ai/chat`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ target, message: trimmed }),
        });

        if (!response.ok || !response.body) {
          throw new Error('Failed to reach the AI service');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let idx;
          while ((idx = buffer.indexOf('\n\n')) !== -1) {
            const frame = buffer.slice(0, idx);
            buffer = buffer.slice(idx + 2);
            const parsed = parseSseFrame(frame);
            if (!parsed) continue;

            const data = JSON.parse(parsed.data);
            if (parsed.event === 'progress') {
              setProgressStage(data.stage);
            } else if (parsed.event === 'final') {
              setLiveMessages((prev) => [
                ...prev,
                { role: 'assistant', content: data.answer, citations: data.citations },
              ]);
            } else if (parsed.event === 'error') {
              setError(data.message || 'Something went wrong');
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsStreaming(false);
        setProgressStage(null);
      }
    },
    [target, isStreaming]
  );

  const messages: AiChatMessage[] = [...(historyQuery.data ?? []), ...liveMessages];

  return {
    messages,
    isLoadingHistory: historyQuery.isLoading,
    send,
    isStreaming,
    progressStage,
    progressLabel: progressStage ? PROGRESS_LABELS[progressStage] || 'Working on it...' : null,
    error,
  };
}
