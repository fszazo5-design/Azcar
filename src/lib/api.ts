import type { Dhikr, DhikrCategory, LibraryCard } from '@/types';

const QURAN_API = 'https://api.alquran.cloud/v1';
const ADHKAR_BASE = 'https://ahegazy.github.io/muslimKit/json';

export const reciters = [
  { id: 'ar.alafasy', name: 'مشاري راشد العفاسي' },
  { id: 'ar.husary', name: 'محمود خليل الحصري' },
  { id: 'ar.minshawi', name: 'محمد صديق المنشاوي' },
  { id: 'ar.sudais', name: 'عبدالرحمن السديس' },
  { id: 'ar.shuraim', name: 'سعود الشريم' },
  { id: 'ar.abdulbasit', name: 'عبدالباسط عبدالصمد' },
  { id: 'ar.ajamy', name: 'أحمد العجمي' },
] as const;

export interface SurahSummary {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface SurahAudioAyah {
  numberInSurah: number;
  text: string;
  audio: string;
}

export interface SurahDetails extends SurahSummary {
  ayahs: SurahAudioAyah[];
}

interface AdhkarResponse { title: string; content: { zekr: string; repeat: number; bless?: string }[] }

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`API ${response.status}`);
  return response.json() as Promise<T>;
}

export async function getSurahs(): Promise<SurahSummary[]> {
  const result = await getJson<{ data: SurahSummary[] }>(`${QURAN_API}/surah`);
  return result.data;
}

export async function getSurah(number: number, reciter = 'ar.alafasy'): Promise<SurahDetails> {
  const result = await getJson<{ data: SurahDetails }>(`${QURAN_API}/surah/${number}/${reciter}`);
  return result.data;
}

export async function getAdhkar(category: Exclude<DhikrCategory, 'after_prayer'>): Promise<Dhikr[]> {
  const file = category === 'morning' ? 'azkar_sabah.json' : 'azkar_massa.json';
  const result = await getJson<AdhkarResponse>(`${ADHKAR_BASE}/${file}`);
  return result.content.map((item, index) => ({
    id: `api-${category}-${index}`,
    category,
    text: item.zekr,
    count: Number(item.repeat) || 1,
    virtue: item.bless,
    source: 'حصن المسلم',
  }));
}

export async function getInfoCards(endpoint = import.meta.env.VITE_INFO_API_URL): Promise<LibraryCard[]> {
  if (!endpoint) return [];
  const result = await getJson<{ data?: LibraryCard[] } | LibraryCard[]>(endpoint);
  return Array.isArray(result) ? result : result.data ?? [];
}

export const apiSources = {
  quran: 'https://alquran.cloud/api',
  audio: 'https://alquran.cloud/cdn',
  adhkar: 'https://ahegazy.github.io/muslimKit/json/',
};
