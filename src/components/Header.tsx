import { Moon, Sun, Bell } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function Header() {
  const { settings, toggleTheme } = useApp();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/60 bg-white/80 backdrop-blur-lg dark:border-gray-700/40 dark:bg-gray-900/80">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-md shadow-primary-500/30">
            <Bell size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight text-gray-800 dark:text-gray-100">نور</h1>
            <p className="text-[10px] leading-tight text-gray-400 dark:text-gray-500">أذكار وأدعية</p>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="icon-btn bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-700"
          aria-label="تبديل الوضع"
        >
          {settings.theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}
