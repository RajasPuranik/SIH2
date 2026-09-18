import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type { ChatConversation, ChatMessage, Citation, ToolCall, SearchResult } from '../types';
import { chatStream, type ChatStreamResult } from '../lib/api';

interface ChatState {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  isStreaming: boolean;
  isPanelOpen: boolean;
}

interface ChatContextValue extends ChatState {
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  sendMessage: (content: string) => Promise<void>;
  createConversation: () => string;
  setActiveConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
  deleteConversation: (id: string) => void;
  activeConversation: ChatConversation | null;
  streamingContent: string;
  streamingToolCalls: ToolCall[];
}

const ChatContext = createContext<ChatContextValue | null>(null);

function generateId(): string {
  return `conv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ChatState>({
    conversations: [],
    activeConversationId: null,
    isStreaming: false,
    isPanelOpen: false,
  });
  const [streamingContent, setStreamingContent] = useState('');
  const [streamingToolCalls, setStreamingToolCalls] = useState<ToolCall[]>([]);

  // Hydrate conversations from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ss-chat-conversations');
      if (stored) {
        const parsed = JSON.parse(stored) as ChatConversation[];
        setState(prev => ({ ...prev, conversations: parsed }));
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist conversations
  useEffect(() => {
    localStorage.setItem('ss-chat-conversations', JSON.stringify(state.conversations));
  }, [state.conversations]);

  const openPanel = useCallback(() => {
    setState(prev => ({ ...prev, isPanelOpen: true }));
  }, []);

  const closePanel = useCallback(() => {
    setState(prev => ({ ...prev, isPanelOpen: false }));
  }, []);

  const togglePanel = useCallback(() => {
    setState(prev => ({ ...prev, isPanelOpen: !prev.isPanelOpen }));
  }, []);

  const createConversation = useCallback((): string => {
    const id = generateId();
    const conv: ChatConversation = {
      id,
      title: 'New conversation',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setState(prev => ({
      ...prev,
      conversations: [conv, ...prev.conversations],
      activeConversationId: id,
    }));
    return id;
  }, []);

  const setActiveConversation = useCallback((id: string) => {
    setState(prev => ({ ...prev, activeConversationId: id }));
  }, []);

  const renameConversation = useCallback((id: string, title: string) => {
    setState(prev => ({
      ...prev,
      conversations: prev.conversations.map(c =>
        c.id === id ? { ...c, title } : c
      ),
    }));
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      conversations: prev.conversations.filter(c => c.id !== id),
      activeConversationId:
        prev.activeConversationId === id ? null : prev.activeConversationId,
    }));
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    let convId = state.activeConversationId;

    // Create a new conversation if none active
    if (!convId) {
      const id = generateId();
      const conv: ChatConversation = {
        id,
        title: content.slice(0, 40) + (content.length > 40 ? '...' : ''),
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setState(prev => ({
        ...prev,
        conversations: [conv, ...prev.conversations],
        activeConversationId: id,
      }));
      convId = id;
    }

    // Add user message
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setState(prev => ({
      ...prev,
      conversations: prev.conversations.map(c =>
        c.id === convId
          ? {
              ...c,
              messages: [...c.messages, userMsg],
              title: c.messages.length === 0
                ? content.slice(0, 40) + (content.length > 40 ? '...' : '')
                : c.title,
              updatedAt: Date.now(),
            }
          : c
      ),
      isStreaming: true,
    }));

    setStreamingContent('');
    setStreamingToolCalls([]);

    // Stream the response
    try {
      const stream = chatStream(content);
      let fullContent = '';
      const toolCalls: ToolCall[] = [];
      let finalResult: ChatStreamResult | null = null;

      for await (const chunk of stream) {
        if (chunk.type === 'tool') {
          const tc = JSON.parse(chunk.data as string) as ToolCall;
          toolCalls.push(tc);
          setStreamingToolCalls([...toolCalls]);
        } else if (chunk.type === 'token') {
          fullContent += chunk.data as string;
          setStreamingContent(fullContent);
        } else if (chunk.type === 'done') {
          finalResult = chunk.data as ChatStreamResult;
        }
      }

      // Add assistant message
      if (finalResult) {
        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: finalResult.content,
          citations: finalResult.citations as Citation[],
          toolCalls: finalResult.toolCalls as ToolCall[],
          suggestedQuestions: finalResult.suggestedQuestions,
          inlineStandards: finalResult.inlineResults as SearchResult[],
          timestamp: Date.now(),
        };

        setState(prev => ({
          ...prev,
          conversations: prev.conversations.map(c =>
            c.id === convId
              ? { ...c, messages: [...c.messages, assistantMsg], updatedAt: Date.now() }
              : c
          ),
          isStreaming: false,
        }));
      }
    } catch {
      setState(prev => ({ ...prev, isStreaming: false }));
    }

    setStreamingContent('');
    setStreamingToolCalls([]);
  }, [state.activeConversationId]);

  const activeConversation = state.conversations.find(c => c.id === state.activeConversationId) ?? null;

  return (
    <ChatContext.Provider
      value={{
        ...state,
        openPanel,
        closePanel,
        togglePanel,
        sendMessage,
        createConversation,
        setActiveConversation,
        renameConversation,
        deleteConversation,
        activeConversation,
        streamingContent,
        streamingToolCalls,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within a ChatProvider');
  return ctx;
}
