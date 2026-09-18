import { Sparkles } from 'lucide-react';

interface SuggestedQuestionsProps {
  questions: string[];
  onQuestionClick: (q: string) => void;
}

export function SuggestedQuestions({ questions, onQuestionClick }: SuggestedQuestionsProps) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-2 items-center">
      <Sparkles className="w-4 h-4 text-indigo-500 mr-1" />
      {questions.map((q, i) => (
        <button
          key={i}
          onClick={() => onQuestionClick(q)}
          className="text-xs px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-white dark:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
