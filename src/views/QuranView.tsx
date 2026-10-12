import { useEffect, useRef, useState } from 'react';
import { BookOpen, LoaderCircle, Pause, Play, Radio, RotateCcw, WifiOff } from 'lucide-react';
import { getAyahAudioUrl, getSurah, getSurahs, reciters, type SurahDetails, type SurahSummary } from '@/lib/api';

export function QuranView() {
  const [surahs, setSurahs] = useState<SurahSummary[]>([]);
  const [surahNumber, setSurahNumber] = useState(1);
  const [reciter, setReciter] = useState('ar.alafasy');
  const [surah, setSurah] = useState<SurahDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeAyah, setActiveAyah] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    getSurahs()
      .then((items) => { setSurahs(items); setError(false); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(false);
    setActiveAyah(null);
    setPlaying(false);
    getSurah(surahNumber, reciter)
      .then((details) => { setSurah(details); setAudioError(false); })
      .catch(() => { setSurah(null); setError(true); })
      .finally(() => setLoading(false));
  }, [surahNumber, reciter]);

  useEffect(() => {
    if (activeAyah === null || !surah || !audioRef.current) return;
    const player = audioRef.current;
    const ayah = surah.ayahs[activeAyah - 1];
    player.src = ayah?.audio ?? getAyahAudioUrl(ayah?.number ?? activeAyah, reciter);
    player.load();
    void player.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [activeAyah, reciter, surah]);

  const currentName = surahs.find((item) => item.number === surahNumber)?.name ?? 'سورة الفاتحة';
  const currentAyah = activeAyah && surah ? surah.ayahs[activeAyah - 1] : null;

  const toggleAyah = (ayahNumber: number) => {
    if (activeAyah === ayahNumber && audioRef.current) {
      if (audioRef.current.paused) void audioRef.current.play().then(() => setPlaying(true));
      else { audioRef.current.pause(); setPlaying(false); }
      return;
    }
    setAudioError(false);
    setActiveAyah(ayahNumber);
  };

  return (
    <div className="px-4 py-4">
      <div className="mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-700 to-primary-950 p-5 text-white shadow-lg">
        <div className="mb-2 flex items-center gap-2 text-primary-100"><BookOpen size={18} /><span className="text-sm">القرآن الكريم</span></div>
        <h2 className="text-2xl font-bold">استمع وتدبّر</h2>
        <p className="mt-1 text-sm text-primary-100">اختر السورة والقارئ ثم اضغط تشغيل بجوار الآية</p>
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
        <div className="flex items-center gap-2 text-xs text-gray-400"><Radio size={14} className="text-primary-500" /> اضغط تشغيل لبدء الصوت مباشرة من الإنترنت</div>
        {currentAyah && (
          <div className="rounded-xl bg-primary-50 p-3 dark:bg-primary-900/30">
            <audio ref={audioRef} className="h-9 w-full" controls preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onError={() => { setAudioError(true); setPlaying(false); }}>
              <track kind="captions" />
            </audio>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-300">الآية رقم {activeAyah}{playing ? ' — قيد التشغيل' : ''}</p>
          </div>
        )}
        {audioError && <p className="text-xs text-error-600 dark:text-error-300">تعذر تشغيل هذا المقطع. تحقق من الإنترنت ثم جرّب مرة أخرى.</p>}
      </div>

      {loading && <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-500"><LoaderCircle className="animate-spin" size={20} /> جارٍ تحميل السورة...</div>}
      {error && !loading && <div className="card mb-4 flex items-center gap-2 text-sm text-warning-700 dark:text-warning-300"><WifiOff size={18} /> تعذر الاتصال بالمصدر الآن. جرّب مرة أخرى عند توفر الإنترنت.</div>}
      {surah && !loading && (
        <div className="space-y-3">
          <div className="mb-2 flex items-center justify-between"><h3 className="font-bold text-gray-800 dark:text-gray-100">{currentName}</h3><span className="text-xs text-gray-400">{surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</span></div>
          {surah.ayahs.map((ayah) => {
            const isActive = activeAyah === ayah.numberInSurah;
            return (
              <div className={`card card-hover ${isActive ? 'ring-2 ring-primary-400' : ''}`} key={ayah.numberInSurah}>
                <div className="mb-3 flex items-start gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">{ayah.numberInSurah}</span><p className="font-quran text-lg leading-loose text-gray-800 dark:text-gray-100">{ayah.text.replace(/^\uFEFF/, '')}</p></div>
                <button type="button" onClick={() => toggleAyah(ayah.numberInSurah)} className="btn-primary w-full" aria-label={`${isActive && playing ? 'إيقاف' : 'تشغيل'} الآية ${ayah.numberInSurah}`}>
                  {isActive && playing ? <Pause size={17} /> : <Play size={17} />}
                  {isActive && playing ? 'إيقاف التلاوة' : 'تشغيل التلاوة'}
                </button>
              </div>
            );
          })}
        </div>
      )}
      {!surahs.length && !loading && <div className="card text-center text-sm text-gray-500"><RotateCcw className="mx-auto mb-2" size={20} />لا توجد بيانات للعرض حالياً.</div>}
    </div>
  );
}
