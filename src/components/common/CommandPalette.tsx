import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Home, List, ShoppingBag, Settings, Moon, Sun, MessageSquare } from 'lucide-react';
// @ts-ignore
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import { useTheme } from '../../hooks/useTheme';
// @ts-ignore
import { useChat } from '../../hooks/useChat';

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const navigate = useNavigate();
  // Using try/catch or optional chaining in case hooks are not implemented yet
  const themeHook = typeof useTheme === 'function' ? useTheme() : { theme: 'light', toggleTheme: () => {} };
  const chatHook = typeof useChat === 'function' ? useChat() : { openPanel: () => {} };
  
  const { theme, toggleTheme } = themeHook;
  const { openPanel } = chatHook;
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  const commands = [
    { id: 'nav-home', label: 'Go to Home', icon: Home, category: 'Navigation', action: () => navigate('/') },
    { id: 'nav-results', label: 'View Results', icon: List, category: 'Navigation', action: () => navigate('/results') },
    { id: 'nav-basket', label: 'View Basket', icon: ShoppingBag, category: 'Navigation', action: () => navigate('/basket') },
    { id: 'nav-admin', label: 'Admin Dashboard', icon: Settings, category: 'Navigation', action: () => navigate('/admin') },
    { id: 'action-theme', label: `Toggle Theme (${theme === 'dark' ? 'Light' : 'Dark'})`, icon: theme === 'dark' ? Sun : Moon, category: 'Actions', action: toggleTheme },
    { id: 'action-chat', label: 'Open Chat', icon: MessageSquare, category: 'Actions', action: openPanel },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter' && filteredCommands.length > 0) {
      e.preventDefault();
      const selected = filteredCommands[selectedIndex];
      selected.action();
      setIsOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] pointer-events-none px-4">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command Palette"
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden pointer-events-auto"
            >
              <div className="flex items-center px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                <Search className="w-5 h-5 text-zinc-400 mr-3" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a command or search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent border-none outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400"
                />
                <div className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-xs text-zinc-500 font-medium">
                  ESC
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto p-2">
                {filteredCommands.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
                    No results found for "{query}"
                  </div>
                ) : (
                  Object.entries(
                    filteredCommands.reduce((acc, cmd) => {
                      if (!acc[cmd.category]) acc[cmd.category] = [];
                      acc[cmd.category].push(cmd);
                      return acc;
                    }, {} as Record<string, typeof commands>)
                  ).map(([category, cmds]) => (
                    <div key={category} className="mb-2">
                      <div className="px-3 py-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        {category}
                      </div>
                      {cmds.map((cmd) => {
                        const index = filteredCommands.findIndex((c) => c.id === cmd.id);
                        const isSelected = index === selectedIndex;
                        const Icon = cmd.icon;
                        
                        return (
                          <div
                            key={cmd.id}
                            className={`flex items-center px-3 py-2.5 rounded-lg cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400'
                                : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                            }`}
                            onClick={() => {
                              cmd.action();
                              setIsOpen(false);
                            }}
                            onMouseEnter={() => setSelectedIndex(index)}
                          >
                            <Icon className="w-4 h-4 mr-3 opacity-70" />
                            <span className="text-sm font-medium">{cmd.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
