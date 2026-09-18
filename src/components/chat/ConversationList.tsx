import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { ChatConversation } from '../../types';

interface ConversationListProps {
  conversations: ChatConversation[];
  activeId: string | null;
  onCreate: () => void;
  onSelect: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
}

export function ConversationList({
  conversations,
  activeId,
  onCreate,
  onSelect,
  onRename,
  onDelete
}: ConversationListProps) {
  return (
    <div className="w-64 border-r border-zinc-200 dark:border-zinc-800 h-full flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <div className="p-4">
        <button
          onClick={onCreate}
          className="w-full flex items-center justify-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-sm font-medium py-2 px-4 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 text-zinc-900 dark:text-zinc-100"
        >
          <Plus className="w-4 h-4" />
          New conversation
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
        {conversations.map(conv => (
          <div
            key={conv.id}
            className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
              activeId === conv.id
                ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                : 'hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400'
            }`}
            onClick={() => onSelect(conv.id)}
          >
            <div className="truncate text-sm flex-1 mr-2">{conv.title}</div>
            
            <div className="hidden group-hover:flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const newTitle = prompt('New title:', conv.title);
                  if (newTitle) onRename(conv.id, newTitle);
                }}
                className="p-1 hover:text-indigo-600 dark:hover:text-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                aria-label="Rename"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Delete conversation?')) onDelete(conv.id);
                }}
                className="p-1 hover:text-red-600 dark:hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                aria-label="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
