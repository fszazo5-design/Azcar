import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from 'react';
import type { Settings, TabKey } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { defaultSettings, applyTheme, applyFontScale } from '@/lib/settings';
import { scheduleNotification, cancelNotification, parseTimeString } from '@/lib/notifications';

interface AppContextValue {
  settings: Settings;
  updateSettings: (partial: Partial<Settings>) => void;
  tab: TabKey;
  setTab: (t: TabKey) => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useLocalStorage<Settings>('nour-settings', defaultSettings);
  const [tab, setTab] = useLocalStorage<TabKey>('nour-tab', 'adhkar');

  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  useEffect(() => {
    applyFontScale(settings.fontScale);
  }, [settings.fontScale]);

  // Manage notification schedules
  useEffect(() => {
    if (settings.morningNotification) {
      const { hour, minute } = parseTimeString(settings.morningTime);
      scheduleNotification({
        id: 'morning',
        hour,
        minute,
        title: 'أذكار الصباح',
        body: 'حان وقت أذكار الصباح، ابدأ يومك بذكر الله',
      });
    } else {
      cancelNotification('morning');
    }

    if (settings.eveningNotification) {
      const { hour, minute } = parseTimeString(settings.eveningTime);
      scheduleNotification({
        id: 'evening',
        hour,
        minute,
        title: 'أذكار المساء',
        body: 'حان وقت أذكار المساء، اختم يومك بذكر الله',
      });
    } else {
      cancelNotification('evening');
    }

    return () => {
      cancelNotification('morning');
      cancelNotification('evening');
    };
  }, [settings.morningNotification, settings.eveningNotification, settings.morningTime, settings.eveningTime]);

  const updateSettings = useCallback(
    (partial: Partial<Settings>) => {
      setSettings((prev) => ({ ...prev, ...partial }));
    },
    [setSettings],
  );

  const toggleTheme = useCallback(() => {
    setSettings((prev) => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  }, [setSettings]);

  const value = useMemo(
    () => ({ settings, updateSettings, tab, setTab, toggleTheme }),
    [settings, updateSettings, tab, setTab, toggleTheme],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
