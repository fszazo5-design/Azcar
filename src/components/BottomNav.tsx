import { BookOpen, Heart, Info, Settings as SettingsIcon, Volume2 } from 'lucide-react';
import type { TabKey } from '@/types';
import { useApp } from '@/context/AppContext';
import { vibrateClick } from '@/lib/vibrate';

const tabs: { key: TabKey; label: string; icon: typeof BookOpen }[] = [
  { key: 'quran', label: 'القرآن', icon: Volume2 },
  { key: 'adhkar', label: 'الأذكار', icon: BookOpen },
  { key: 'duas', label: 'الأدعية', icon: Heart },
  { key: 'library', label: 'معلومات', icon: Info },
  { key: 'settings', label: 'إعدادات', icon: SettingsIcon },
];

export function BottomNav() {
  const { tab, setTab } = useApp();

  const handleTab = (key: TabKey) => {
    vibrateClick();
    setTab(key);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200/60 bg-white/90 backdrop-blur-lg dark:border-gray-700/40 dark:bg-gray-900/90">
      <div className="mx-auto flex max-w-2xl items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {tabs.map(({ key, label, icon: Icon }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              onClick={() => handleTab(key)}
              className={`nav-item flex-1 pt-2.5 ${
                active
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              <span>{label}</span>
              {active && (
                <span className="absolute -mt-1.5 h-1 w-8 rounded-full bg-primary-500" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
