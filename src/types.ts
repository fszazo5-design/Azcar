export type DhikrCategory = 'morning' | 'evening' | 'after_prayer';

export interface Dhikr {
  id: string;
  category: DhikrCategory;
  text: string;
  count: number;
  virtue?: string;
  source?: string;
}

export type PrayerKey = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PostPrayerDhikr {
  id: string;
  text: string;
  count: number;
  repeat?: boolean;
}

export interface DuaData {
  id: string;
  category: string;
  title: string;
  text: string;
  source?: string;
}

export interface LibraryCard {
  id: string;
  section: 'first_aid' | 'wisdom';
  title: string;
  body: string;
  tag?: string;
}

export interface Settings {
  theme: 'light' | 'dark';
  fontScale: number;
  morningNotification: boolean;
  eveningNotification: boolean;
  morningTime: string;
  eveningTime: string;
}

export type TabKey = 'adhkar' | 'duas' | 'library' | 'settings';
