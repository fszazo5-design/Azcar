import type { Settings } from '@/types';

export const defaultSettings: Settings = {
  theme: 'dark',
  fontScale: 1,
  morningNotification: false,
  eveningNotification: false,
  morningTime: '05:30',
  eveningTime: '18:00',
};

export function applyTheme(theme: 'light' | 'dark'): void {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', theme === 'dark' ? '#0f172a' : '#0f766e');
  }
}

export function applyFontScale(scale: number): void {
  document.documentElement.style.setProperty('--font-scale', String(scale));
}
