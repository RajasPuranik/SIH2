import { useState } from 'react';
import type { ChatMessage as ChatMessageType, Citation } from '../../types';
import { CitationCard } from './CitationCard';
import { ToolCallStrip } from './ToolCallStrip';
import { SuggestedQuestions } from './SuggestedQuestions';

interface ChatMessageProps {
  message: ChatMessageType;
  isStreaming?: boolean;
  onSuggestedQuestionClick?: (q: string) => void;
}

export function ChatMessage({ message, isStreaming, onSuggestedQuestionClick }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);

  const formatContent = (content: string, citations?: Citation[]) => {
    const parts = content.split(/(\[\d+\])/g);
    
    return parts.map((part, index) => {
      const citationMatch = part.match(/\[(\d+)\]/);
      if (citationMatch && citations) {
        const citationIndex = parseInt(citationMatch[1], 10);
        const citationInfo = citations.find(c => c.index === citationIndex);
        
        if (citationInfo) {
          return (
            <span key={index} className="relative inline-block">
              <button
                onClick={() => setActiveCitation(activeCitation?.index === citationIndex ? null : citationInfo)}
                className="text-xs text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 font-semibold align-super mx-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                aria-label={`Citation ${citationIndex}`}
              >
                [{citationIndex}]
              </button>
              {activeCitation?.index === citationIndex && (
                <CitationCard
                  citation={activeCitation}
                  isOpen={true}
                  onClose={() => setActiveCitation(null)}
                />
              )}
            </span>
          );
        }
      }
      
      const boldParts = part.split(/(\*\*.*?\*\*|`.*?`|> .*?\n)/g);
      return (
        <span key={index}>
          {boldParts.map((bp, j) => {
            if (bp.startsWith('**') && bp.endsWith('**')) {
              return <strong key={j} className="font-semibold">{bp.slice(2, -2)}</strong>;
            }
            if (bp.startsWith('`') && bp.endsWith('`')) {
              return <code key={j} className="bg-zinc-200 dark:bg-zinc-700 rounded px-1 text-sm font-mono">{bp.slice(1, -1)}</code>;
            }
            if (bp.startsWith('> ')) {
              return <blockquote key={j} className="border-l-2 border-indigo-500 pl-2 italic my-1 text-zinc-600 dark:text-zinc-400">{bp.slice(2)}</blockquote>;
            }
            return bp;
          })}
        </span>
      );
    });
  };

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] rounded-xl px-4 py-3 ${isUser ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-sm'}`}>
        {!isUser && message.toolCalls && (
          <ToolCallStrip toolCalls={message.toolCalls} />
        )}
        
        <div className="leading-relaxed whitespace-pre-wrap break-words text-[15px]">
          {isUser ? (
            message.content
          ) : (
            <>
              {formatContent(message.content, message.citations)}
              {isStreaming && (
                <span className="inline-block w-1.5 h-4 bg-zinc-900 dark:bg-zinc-100 ml-1 animate-pulse align-middle" />
              )}
            </>
          )}
        </div>

        {!isUser && message.inlineStandards && message.inlineStandards.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.inlineStandards.map((st, idx) => (
              <div key={idx} className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 bg-white dark:bg-zinc-900 text-sm flex justify-between items-center">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">{st.standard.id}</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">{st.standard.title}</span>
              </div>
            ))}
          </div>
        )}

        {!isUser && message.suggestedQuestions && onSuggestedQuestionClick && (
          <SuggestedQuestions questions={message.suggestedQuestions} onQuestionClick={onSuggestedQuestionClick} />
        )}
      </div>
    </div>
  );
}
