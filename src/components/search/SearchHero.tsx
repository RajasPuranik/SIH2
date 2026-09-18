import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { FileDropZone } from './FileDropZone';
import { useLanguage } from '../../hooks/useLanguage';

const EXAMPLE_CHIPS = [
  'LED street lighting luminaires, 90W, IP66',
  'Portland pozzolana cement for bridge works',
  'Multilayer PCB assemblies for defence electronics',
  'Packaged drinking water for municipal supply',
  'Polyester-cotton uniform fabric, 120 GSM'
];

export const SearchHero: React.FC = () => {
  const [query, setQuery] = useState('');
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [query]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    const urlParams = new URLSearchParams();
    urlParams.set('q', query.trim());
    if (language !== 'en') {
      urlParams.set('lang', language);
    }
    navigate(`/results?${urlParams.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-3xl py-12 px-4 sm:px-6">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-64 w-full max-w-lg bg-indigo-500/10 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-8">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            {t('search.title')}
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400">
            {t('search.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="group relative flex flex-col rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/80">
            <textarea
              ref={textareaRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('search.placeholder')}
              className="min-h-[100px] w-full resize-none rounded-t-2xl bg-transparent p-4 pb-12 text-base text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-zinc-100"
              aria-label="Search query"
            />
            
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <span className="hidden text-xs text-zinc-400 sm:inline-block">
                Press Enter ↵ to search
              </span>
              <button
                type="submit"
                disabled={!query.trim()}
                aria-label="Search"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        </form>

        <div className="flex w-full flex-wrap justify-center gap-2">
          {EXAMPLE_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => setQuery(chip)}
              className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-indigo-500/30 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300"
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          <FileDropZone
            onTextExtracted={(text) => {
              setQuery(text);
              textareaRef.current?.focus();
            }}
          />
          <div className="flex flex-col justify-center rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="mb-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {t('search.regional.title')}
            </h3>
            <p className="mb-4 text-xs text-zinc-500 dark:text-zinc-400">
              {t('search.regional.desc')}
            </p>
            <div className="mt-auto flex justify-start">
              <LanguageSelector selectedLanguage={language} onLanguageChange={setLanguage as any} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
