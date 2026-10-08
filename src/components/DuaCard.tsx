import { Copy, Share2, Check } from 'lucide-react';
import { useRef, useState } from 'react';
import type { DuaData } from '@/types';
import { vibrateClick } from '@/lib/vibrate';

interface Props {
  dua: DuaData;
  index: number;
}

export function DuaCard({ dua, index }: Props) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  const handleCopy = async () => {
    vibrateClick();
    try {
      await navigator.clipboard.writeText(dua.text);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard may be unavailable
    }
  };

  const handleShare = async () => {
    vibrateClick();
    const text = `${dua.text}${dua.source ? `\n— ${dua.source}` : ''}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: dua.title, text });
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => setCopied(false), 2000);
      } catch {
        // no clipboard
      }
    }
  };

  return (
    <div
      className="card card-hover animate-fadeUp"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="rounded-lg bg-accent-50 px-2 py-0.5 text-xs font-medium text-accent-700 dark:bg-accent-900/20 dark:text-accent-300">
          {dua.category}
        </span>
      </div>

      <h3 className="mb-2 font-bold text-gray-800 dark:text-gray-100" style={{ fontSize: 'calc(1rem * var(--font-scale))' }}>
        {dua.title}
      </h3>

      <p
        className="mb-3 font-quran leading-loose text-gray-700 dark:text-gray-200"
        style={{ fontSize: 'calc(1.1rem * var(--font-scale))' }}
      >
        {dua.text}
      </p>

      {dua.source && (
        <p className="mb-3 text-xs text-gray-400 dark:text-gray-500">— {dua.source}</p>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all active:scale-95 ${
            copied
              ? 'bg-success-50 text-success-700 dark:bg-success-700/20 dark:text-success-400'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'تم النسخ' : 'نسخ'}
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-600 transition-all hover:bg-gray-200 active:scale-95 dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <Share2 size={16} />
          مشاركة
        </button>
      </div>
    </div>
  );
}
