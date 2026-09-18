import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, CheckCircle, XCircle } from 'lucide-react';
import { parseFile } from '../../lib/api';

interface FileDropZoneProps {
  onTextExtracted: (text: string) => void;
}

export function FileDropZone({ onTextExtracted }: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.pdf') && !file.name.endsWith('.docx')) {
      setStatus('error');
      return;
    }

    setFileName(file.name);
    setStatus('uploading');
    setProgress(0);

    try {
      let extractedText = '';
      for await (const chunk of parseFile(file)) {
        setProgress(chunk.progress);
        if (chunk.text) {
          extractedText = chunk.text;
        }
      }
      setStatus('success');
      if (extractedText) {
        setTimeout(() => onTextExtracted(extractedText), 400);
      }
    } catch {
      setStatus('error');
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, []);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
        isDragging
          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20'
          : status === 'error'
            ? 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/20'
            : status === 'success'
              ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20'
              : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
      }`}
      role="region"
      aria-label="File upload drop zone"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload file"
      />

      {status === 'idle' && (
        <div>
          <Upload size={24} className="mx-auto mb-2 text-zinc-400" />
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Drop a <span className="font-medium">PDF</span> or <span className="font-medium">DOCX</span> file here
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline focus-ring rounded"
          >
            or browse files
          </button>
        </div>
      )}

      {status === 'uploading' && (
        <div>
          <FileText size={24} className="mx-auto mb-2 text-indigo-500" />
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">{fileName}</p>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-zinc-500 tabular-nums">{progress}% parsed</p>
        </div>
      )}

      {status === 'success' && (
        <div>
          <CheckCircle size={24} className="mx-auto mb-2 text-emerald-500" />
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">{fileName}</p>
          <p className="text-xs text-zinc-500 mt-1">Text extracted successfully</p>
        </div>
      )}

      {status === 'error' && (
        <div>
          <XCircle size={24} className="mx-auto mb-2 text-red-500" />
          <p className="text-sm text-red-600 dark:text-red-400">
            Only PDF and DOCX files are supported
          </p>
          <button
            onClick={() => { setStatus('idle'); setFileName(null); }}
            className="mt-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline focus-ring rounded"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
