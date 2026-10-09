import { useEffect, useState } from 'react';
import { BookOpen, Headphones, LoaderCircle, Radio, WifiOff } from 'lucide-react';
import { getSurah, getSurahs, reciters, type SurahDetails, type SurahSummary } from '@/lib/api';

export function QuranView() {
  const [surahs, setSurahs] = useState<SurahSummary[]>([]);
  const [surahNumber, setSurahNumber] = useState(1);
  const [reciter, setReciter] = useState('ar.alafasy');
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [surah, setSurah] = useState<SurahDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getSurahs().then(setSurahs).catch(() => setError(true)).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    getSurah(surahNumber, reciter)
      .then(setSurah)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [surahNumber, reciter]);

  const currentName = surahs.find((item) => item.number === surahNumber)?.name ?? 'سورة الفاتحة';

  return (
    <div className="px-4 py-4">
      <div className="mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-700 to-primary-950 p-5 text-white shadow-lg">
        <div className="mb-2 flex items-center gap-2 text-primary-100"><BookOpen size={18} /><span className="text-sm">القرآن الكريم</span></div>
        <h2 className="text-2xl font-bold">استمع وتدبّر</h2>
        <p className="mt-1 text-sm text-primary-100">اختر السورة والقارئ المفضل لديك</p>
      </div>

      <div className="card mb-5 space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">السورة</label>
        <select className="input" value={surahNumber} onChange={(e) => setSurahNumber(Number(e.target.value))} disabled={!surahs.length}>
          {surahs.map((item) => <option key={item.number} value={item.number}>{item.number}. {item.name} — {item.numberOfAyahs} آية</option>)}
        </select>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">القارئ</label>
        <select className="input" value={reciter} onChange={(e) => setReciter(e.target.value)}>
          {reciters.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <div className="flex items-center gap-2 text-xs text-gray-400"><Radio size={14} className="text-primary-500" /> الصوت يُبث مباشرة ولا يُخزّن على الجهاز</div>
        <button type="button" onClick={() => setAudioEnabled((value) => !value)} className="btn-primary w-full">
          <Headphones size={17} /> {audioEnabled ? 'إخفاء مشغل التلاوة' : 'تشغيل التلاوة عند الطلب'}
        </button>
      </div>

      {loading && <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-500"><LoaderCircle className="animate-spin" size={20} /> جارٍ تحميل السورة...</div>}
      {error && !loading && <div className="card mb-4 flex items-center gap-2 text-sm text-warning-700 dark:text-warning-300"><WifiOff size={18} /> تعذر الاتصال بالمصدر الآن. جرّب مرة أخرى عند توفر الإنترنت.</div>}
      {surah && !loading && (
        <div className="space-y-3">
          <div className="mb-2 flex items-center justify-between"><h3 className="font-bold text-gray-800 dark:text-gray-100">{currentName}</h3><span className="text-xs text-gray-400">{surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</span></div>
          {surah.ayahs.map((ayah) => (
            <div className="card card-hover" key={ayah.numberInSurah}>
              <div className="mb-3 flex items-start gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">{ayah.numberInSurah}</span><p className="font-quran text-lg leading-loose text-gray-800 dark:text-gray-100">{ayah.text.replace(/^\uFEFF/, '')}</p></div>
              {audioEnabled ? <audio className="h-9 w-full" controls preload="none" src={ayah.audio}><track kind="captions" /></audio> : <p className="text-xs text-gray-400">التلاوة اختيارية — اضغط «تشغيل التلاوة عند الطلب» لعرض المشغل.</p>}
            </div>
          ))}
        </div>
      )}
      {!surahs.length && !loading && <div className="card text-center text-sm text-gray-500">لا توجد بيانات للعرض حالياً.</div>}
    </div>
  );
}
