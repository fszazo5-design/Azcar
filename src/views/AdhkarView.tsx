import { Sunrise, Moon, AlarmClock } from 'lucide-react';
import type { DhikrCategory } from '@/types';
import { morningAdhkar, eveningAdhkar, afterPrayerAdhkar } from '@/data/adhkar';
import { DhikrCard } from '@/components/DhikrCard';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type Filter = DhikrCategory | 'all';

const filters: { key: Filter; label: string; icon: typeof Sunrise }[] = [
  { key: 'morning', label: 'الصباح', icon: Sunrise },
  { key: 'evening', label: 'المساء', icon: Moon },
  { key: 'after_prayer', label: 'بعد الصلاة', icon: AlarmClock },
];

export function AdhkarView() {
  const [filter, setFilter] = useLocalStorage<Filter>('nour-adhkar-filter', 'morning');
  const [counts] = useLocalStorage<Record<string, number>>('nour-counts', {});

  const adhkar =
    filter === 'morning'
      ? morningAdhkar
      : filter === 'evening'
        ? eveningAdhkar
        : afterPrayerAdhkar;

  const total = adhkar.length;
  const done = adhkar.filter((d) => (counts[d.id] ?? 0) >= d.count).length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="px-4 py-4">
      {/* Progress overview */}
      <div className="mb-5 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-5 text-white shadow-lg shadow-primary-500/20">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">تقدّمك اليوم</p>
            <p className="text-3xl font-bold">{progress}%</p>
          </div>
          <div className="text-end">
            <p className="text-sm opacity-80">المكتمل</p>
            <p className="text-2xl font-bold">
              {done} <span className="text-base opacity-60">/ {total}</span>
            </p>
          </div>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Filter chips */}
      <div className="mb-5 flex gap-2">
        {filters.map(({ key, label, icon: Icon }) => {
          const active = filter === key;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all active:scale-95 ${
                active
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30'
                  : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Dhikr cards */}
      <div className="relative space-y-3">
        {adhkar.map((dhikr, i) => (
          <DhikrCard key={dhikr.id} dhikr={dhikr} index={i} />
        ))}
      </div>
    </div>
  );
}
