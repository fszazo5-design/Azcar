import { useRef, useState } from 'react';
import { Copy, Check, Stethoscope, Lightbulb } from 'lucide-react';
import type { LibraryCard } from '@/types';
import { vibrateClick } from '@/lib/vibrate';

interface Props {
  card: LibraryCard;
  index: number;
}

export function InfoCard({ card, index }: Props) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  const handleCopy = async () => {
    vibrateClick();
    try {
      await navigator.clipboard.writeText(`${card.title}\n${card.body}`);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard may be unavailable
    }
  };

  const isAid = card.section === 'first_aid';
  const Icon = isAid ? Stethoscope : Lightbulb;

  return (
    <div
      className="card card-hover animate-fadeUp"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="mb-3 flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            isAid
              ? 'bg-error-100 text-error-600 dark:bg-error-500/20 dark:text-error-400'
              : 'bg-warning-100 text-warning-600 dark:bg-warning-500/20 dark:text-warning-400'
          }`}
        >
          <Icon size={20} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-800 dark:text-gray-100" style={{ fontSize: 'calc(1rem * var(--font-scale))' }}>
            {card.title}
          </h3>
          {card.tag && (
            <span className="mt-0.5 inline-block text-xs text-gray-400 dark:text-gray-500">{card.tag}</span>
          )}
        </div>
      </div>

      <p className="mb-3 leading-relaxed text-gray-600 dark:text-gray-300" style={{ fontSize: 'calc(0.9rem * var(--font-scale))' }}>
        {card.body}
      </p>

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
    </div>
  );
}
