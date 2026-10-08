import { useState } from 'react';
import { GraduationCap, Plane, Wallet, CloudRain } from 'lucide-react';
import { duas, duaCategories } from '@/data/duas';
import { DuaCard } from '@/components/DuaCard';

const categoryIcons: Record<string, typeof GraduationCap> = {
  'الامتحانات': GraduationCap,
  'السفر': Plane,
  'الرزق': Wallet,
  'الهم والحزن': CloudRain,
};

export function DuasView() {
  const [active, setActive] = useState<string>(duaCategories[0]);

  const filtered = duas.filter((d) => d.category === active);

  return (
    <div className="px-4 py-4">
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        اختر الموقف المناسب لتجد الدعاء المناسب
      </p>

      {/* Category cards */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        {duaCategories.map((cat) => {
          const Icon = categoryIcons[cat] ?? GraduationCap;
          const isActive = active === cat;
          return (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`flex items-center gap-3 rounded-2xl p-4 text-start transition-all active:scale-95 ${
                isActive
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                  : 'bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700'
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  isActive
                    ? 'bg-white/20'
                    : 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                }`}
              >
                <Icon size={20} />
              </div>
              <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                {cat}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dua cards */}
      <div className="space-y-3">
        {filtered.map((dua, i) => (
          <DuaCard key={dua.id} dua={dua} index={i} />
        ))}
      </div>
    </div>
  );
}
