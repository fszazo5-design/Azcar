import { useRef, useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import type { Dhikr } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { vibrateShort, vibrateSuccess } from '@/lib/vibrate';

interface Props {
  dhikr: Dhikr;
  index: number;
}

export function DhikrCard({ dhikr, index }: Props) {
  const [counts, setCounts] = useLocalStorage<Record<string, number>>('nour-counts', {});
  const [flash, setFlash] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const current = counts[dhikr.id] ?? 0;
  const isComplete = current >= dhikr.count;

  const increment = () => {
    if (isComplete) return;
    const next = current + 1;
    setCounts((prev) => ({ ...prev, [dhikr.id]: next }));
    vibrateShort();
    if (next >= dhikr.count) {
      vibrateSuccess();
      setFlash(true);
      setTimeout(() => setFlash(false), 600);
    }
  };

  const reset = () => {
    setCounts((prev) => {
      const copy = { ...prev };
      delete copy[dhikr.id];
      return copy;
    });
    vibrateShort();
  };

  const progress = Math.min((current / dhikr.count) * 100, 100);
  const isHighCount = dhikr.count >= 33;

  return (
    <div
      ref={cardRef}
      className={`card card-hover animate-fadeUp overflow-hidden ${
        flash ? 'ring-2 ring-primary-400 dark:ring-primary-500' : ''
      } ${isComplete ? 'border-primary-300 dark:border-primary-700' : ''}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Progress bar */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gray-100 dark:bg-gray-700/50">
        <div
          className="h-full bg-gradient-to-l from-primary-400 to-primary-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="rounded-lg bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
          {index + 1}
        </span>
        {isComplete && (
          <span className="flex items-center gap-1 rounded-lg bg-success-50 px-2 py-0.5 text-xs font-medium text-success-700 dark:bg-success-700/20 dark:text-success-400">
            <Check size={14} strokeWidth={3} />
            تم
          </span>
        )}
      </div>

      <p
        className="mb-3 font-quran leading-loose text-gray-800 dark:text-gray-100"
        style={{ fontSize: 'calc(1.15rem * var(--font-scale))' }}
      >
        {dhikr.text}
      </p>

      {dhikr.virtue && (
        <p className="mb-3 rounded-lg bg-accent-50 px-3 py-1.5 text-xs text-accent-700 dark:bg-accent-900/20 dark:text-accent-300">
          ✦ {dhikr.virtue}
        </p>
      )}

      <div className="flex items-center gap-3">
        {/* Counter button */}
        <button
          onClick={increment}
          disabled={isComplete}
          className={`no-select relative flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl transition-all active:scale-90 ${
            isComplete
              ? 'bg-success-500 text-white'
              : flash
                ? 'bg-primary-500 text-white animate-pop'
                : 'bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-md shadow-primary-500/30'
          }`}
        >
          {isComplete ? (
            <Check size={26} strokeWidth={3} />
          ) : (
            <>
              <span className="text-2xl font-bold leading-none">{current}</span>
              <span className="text-[10px] opacity-80">/ {dhikr.count}</span>
            </>
          )}
        </button>

        {/* Info */}
        <div className="flex-1">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            التكرار: {dhikr.count} مرة
          </p>
          {dhikr.source && (
            <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">المصدر: {dhikr.source}</p>
          )}
          {isHighCount && !isComplete && (
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
              <div
                className="h-full rounded-full bg-primary-400 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Reset */}
        {current > 0 && (
          <button
            onClick={reset}
            className="icon-btn text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400"
            aria-label="إعادة"
          >
            <RotateCcw size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
