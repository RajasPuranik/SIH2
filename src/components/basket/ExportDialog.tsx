import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Copy, Check } from 'lucide-react';
import type { TenderBasketItem } from '../../types';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  items: TenderBasketItem[];
}

type ExportFormat = 'md' | 'csv' | 'clipboard';

export function ExportDialog({ isOpen, onClose, items }: ExportDialogProps) {
  const [format, setFormat] = useState<ExportFormat>('md');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateMarkdown = () => {
    let md = `# Standards Schedule\n\n`;
    items.forEach((item, idx) => {
      md += `## ${idx + 1}. ${item.standard.isNumber}\n`;
      md += `- **Title**: ${item.standard.title}\n`;
      md += `- **Year**: ${item.standard.year}\n`;
      md += `- **Status**: ${item.standard.status}\n`;
      if (item.standard.certifications.length) {
        md += `- **Certifications**: ${item.standard.certifications.join(', ')}\n`;
      }
      md += `\n`;
    });
    return md;
  };

  const generateCsv = () => {
    let csv = `S.No,IS Number,Title,Year,Status,Certifications\n`;
    items.forEach((item, idx) => {
      const certs = item.standard.certifications.join(';');
      csv += `"${idx + 1}","${item.standard.isNumber}","${item.standard.title}","${item.standard.year}","${item.standard.status}","${certs}"\n`;
    });
    return csv;
  };

  const content = format === 'csv' ? generateCsv() : generateMarkdown();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `standards_schedule.${format === 'csv' ? 'csv' : 'md'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Export Basket">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-zinc-200 dark:border-zinc-800"
        >
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-semibold">Export Standards Schedule</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" aria-label="Close dialog">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4 sm:p-6 flex-1 overflow-auto flex flex-col gap-4">
            <div className="flex gap-2">
              {(['md', 'csv', 'clipboard'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${format === f ? 'bg-indigo-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}
                >
                  {f === 'md' ? 'Markdown' : f === 'csv' ? 'CSV' : 'Plain Text'}
                </button>
              ))}
            </div>

            <div className="relative bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-mono whitespace-pre-wrap overflow-auto flex-1">
              {content}
            </div>
          </div>

          <div className="p-4 sm:p-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3 bg-zinc-50 dark:bg-zinc-950/50">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
