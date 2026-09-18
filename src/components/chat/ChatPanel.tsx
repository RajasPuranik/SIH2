import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { ConversationList } from './ConversationList';
import { ChatMessage } from './ChatMessage';

export function ChatPanel() {
  const {
    isPanelOpen,
    closePanel,
    conversations,
    activeConversationId,
    activeConversation,
    createConversation,
    setActiveConversation,
    renameConversation,
    deleteConversation,
    sendMessage,
    isStreaming,
    streamingContent,
    streamingToolCalls
  } = useChat();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPanelOpen) closePanel();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isPanelOpen, closePanel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, streamingContent]);

  const handleSubmit = () => {
    if (!input.trim() || isStreaming) return;
    sendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <AnimatePresence>
      {isPanelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Chat Panel">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-sm"
            onClick={closePanel}
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full sm:w-[480px] md:w-[720px] bg-white dark:bg-zinc-900 h-full shadow-2xl flex rounded-l-2xl overflow-hidden border-l border-zinc-200 dark:border-zinc-800"
          >
            {/* Desktop Left Rail */}
            <div className="hidden md:block">
              <ConversationList
                conversations={conversations}
                activeId={activeConversationId}
                onCreate={createConversation}
                onSelect={setActiveConversation}
                onRename={renameConversation}
                onDelete={deleteConversation}
              />
            </div>
            
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-full bg-white dark:bg-zinc-900 relative">
              {/* Header */}
              <div className="h-14 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4">
                <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Assistant</h2>
                <button
                  onClick={closePanel}
                  aria-label="Close panel"
                  className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4" aria-live="polite">
                {activeConversation?.messages.map((msg) => (
                  <ChatMessage 
                    key={msg.id} 
                    message={msg}
                    onSuggestedQuestionClick={(q) => sendMessage(q)} 
                  />
                ))}
                
                {isStreaming && (
                  <ChatMessage 
                    message={{
                      id: 'streaming',
                      role: 'assistant',
                      content: streamingContent,
                      toolCalls: streamingToolCalls,
                      timestamp: Date.now()
                    }}
                    isStreaming={true}
                  />
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <div className="relative flex items-end border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
                  <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about standards..."
                    className="flex-1 max-h-32 min-h-[44px] bg-transparent resize-none py-3 px-4 outline-none text-sm text-zinc-900 dark:text-zinc-100"
                    rows={1}
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={!input.trim() || isStreaming}
                    className="p-2 m-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
