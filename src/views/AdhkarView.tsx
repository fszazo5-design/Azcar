import { useEffect, useState } from 'react';
import { Sunrise, Moon, AlarmClock, LoaderCircle, WifiOff } from 'lucide-react';
import type { Dhikr, DhikrCategory } from '@/types';
import { morningAdhkar, eveningAdhkar, afterPrayerAdhkar } from '@/data/adhkar';
import { DhikrCard } from '@/components/DhikrCard';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getAdhkar } from '@/lib/api';

type Filter = Exclude<DhikrCategory, 'after_prayer'> | 'after_prayer';
const filters: { key: Filter; label: string; icon: typeof Sunrise }[] = [
  { key: 'morning', label: 'الصباح', icon: Sunrise },
  { key: 'evening', label: 'المساء', icon: Moon },
  { key: 'after_prayer', label: 'بعد الصلاة', icon: AlarmClock },
];

export function AdhkarView() {
  const [filter, setFilter] = useLocalStorage<Filter>('nour-adhkar-filter', 'morning');
  const [counts] = useLocalStorage<Record<string, number>>('nour-counts', {});
  const [remoteAdhkar, setRemoteAdhkar] = useState<Partial<Record<'morning' | 'evening', Dhikr[]>>>({});
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if (filter === 'after_prayer' || remoteAdhkar[filter]) return;
    setLoading(true);
    getAdhkar(filter)
      .then((items) => { setRemoteAdhkar((prev) => ({ ...prev, [filter]: items })); setOffline(false); })
      .catch(() => setOffline(true))
      .finally(() => setLoading(false));
  }, [filter, remoteAdhkar]);

  const fallback = filter === 'morning' ? morningAdhkar : filter === 'evening' ? eveningAdhkar : afterPrayerAdhkar;
  const adhkar = (filter === 'after_prayer' ? fallback : remoteAdhkar[filter] ?? fallback) as Dhikr[];
  const total = adhkar.length;
  const done = adhkar.filter((d) => (counts[d.id] ?? 0) >= d.count).length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="px-4 py-4">
      <div className="mb-5 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-5 text-white shadow-lg shadow-primary-500/20">
        <div className="mb-3 flex items-center justify-between"><div><p className="text-sm opacity-80">تقدّمك اليوم</p><p className="text-3xl font-bold">{progress}%</p></div><div className="text-end"><p className="text-sm opacity-80">المكتمل</p><p className="text-2xl font-bold">{done} <span className="text-base opacity-60">/ {total}</span></p></div></div>
        <div className="h-2 overflow-hidden rounded-full bg-white/20"><div className="h-full rounded-full bg-white transition-all duration-500" style={{ width: `${progress}%` }} /></div>
      </div>
      <div className="mb-5 flex gap-2">{filters.map(({ key, label, icon: Icon }) => <button key={key} onClick={() => setFilter(key)} className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all active:scale-95 ${filter === key ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30' : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}><Icon size={18} />{label}</button>)}</div>
      {loading && <div className="mb-3 flex items-center gap-2 text-xs text-gray-400"><LoaderCircle size={15} className="animate-spin" /> جارٍ تحديث الأذكار من المصدر...</div>}
      {offline && <div className="mb-3 flex items-center gap-2 rounded-xl bg-warning-50 px-3 py-2 text-xs text-warning-700 dark:bg-warning-500/10 dark:text-warning-300"><WifiOff size={15} /> تعمل الآن بالبيانات المحفوظة محلياً.</div>}
      <div className="relative space-y-3">{adhkar.map((dhikr, i) => <DhikrCard key={dhikr.id} dhikr={dhikr} index={i} />)}</div>
    </div>
  );
}
