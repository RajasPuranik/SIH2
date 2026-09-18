import { Link, Outlet } from 'react-router-dom';
import { BookOpen, Sun, Moon, MessageSquare, ShoppingBasket, Menu } from 'lucide-react';
import { useBasket } from '../../hooks/useBasket';
import { useTheme } from '../../hooks/useTheme';
import { useChat } from '../../hooks/useChat';
import { ChatPanel } from '../chat/ChatPanel';
import { CommandPalette } from '../common/CommandPalette';
import { useState } from 'react';

export function AppShell() {
  const { theme, toggleTheme } = useTheme();
  const { itemCount } = useBasket();
  const { openPanel } = useChat();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col">
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 z-40 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-lg" aria-label="StandardSense Home">
            <BookOpen className="w-6 h-6" />
            <span className="hidden sm:inline">StandardSense</span>
          </Link>
          
          <nav className="hidden sm:flex items-center gap-4 text-sm font-medium">
            <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</Link>
            <Link to="/basket" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
              Basket
              {itemCount > 0 && (
                <span className="bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center tabular-nums">
                  {itemCount}
                </span>
              )}
            </Link>
            <Link to="/admin" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Admin</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button 
            className="sm:hidden p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Mobile Menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed top-16 left-0 right-0 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 z-30 p-4 flex flex-col gap-4 sm:hidden">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="font-medium">Home</Link>
          <Link to="/basket" onClick={() => setMobileMenuOpen(false)} className="font-medium flex items-center gap-2">
            Basket
            {itemCount > 0 && (
              <span className="bg-indigo-600 text-white text-xs rounded-full px-2 py-0.5 tabular-nums">
                {itemCount}
              </span>
            )}
          </Link>
          <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="font-medium">Admin</Link>
        </div>
      )}

      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      <button
        onClick={openPanel}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 z-30"
        aria-label="Open Chat"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      <ChatPanel />
      <CommandPalette />
    </div>
  );
}
