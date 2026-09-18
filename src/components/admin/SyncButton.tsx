import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock api generator
async function* triggerSync() {
  yield { status: 'Connecting to BIS catalog...', progress: 10 };
  await new Promise(r => setTimeout(r, 1000));
  yield { status: 'Downloading updates...', progress: 40 };
  await new Promise(r => setTimeout(r, 1500));
  yield { status: 'Updating embedding index...', progress: 70 };
  await new Promise(r => setTimeout(r, 1000));
  yield { status: 'Finalizing...', progress: 90 };
  await new Promise(r => setTimeout(r, 500));
  yield { status: 'Sync Complete', progress: 100 };
}

export function SyncButton() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0);

  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    
    try {
      for await (const state of triggerSync()) {
        setStatus(state.status);
        setProgress(state.progress);
      }
      
      setTimeout(() => {
        setIsSyncing(false);
        setProgress(0);
        setStatus('');
      }, 2000);
    } catch (e) {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2 relative">
      <button
        onClick={handleSync}
        disabled={isSyncing}
        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        aria-label="Trigger Data Sync"
      >
        <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
        {isSyncing ? 'Syncing...' : 'Sync Data'}
      </button>

      <AnimatePresence>
        {isSyncing && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-full mt-3 right-0 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-lg"
          >
            <div className="flex justify-between text-xs font-medium mb-2 text-zinc-600 dark:text-zinc-300">
              <span>{status}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
