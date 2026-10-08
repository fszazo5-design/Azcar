import { useState } from 'react';
import { Stethoscope, Lightbulb } from 'lucide-react';
import { libraryCards, librarySections } from '@/data/library';
import { InfoCard } from '@/components/InfoCard';
import type { LibraryCard } from '@/types';

type Section = LibraryCard['section'];

export function LibraryView() {
  const [section, setSection] = useState<Section>('first_aid');

  const filtered = libraryCards.filter((c) => c.section === section);

  const sections: { key: Section; label: string; icon: typeof Stethoscope }[] = [
    { key: 'first_aid', label: librarySections['first_aid'], icon: Stethoscope },
    { key: 'wisdom', label: librarySections['wisdom'], icon: Lightbulb },
  ];

  return (
    <div className="px-4 py-4">
      {/* Section toggle */}
      <div className="mb-5 flex gap-2">
        {sections.map(({ key, label, icon: Icon }) => {
          const active = section === key;
          return (
            <button
              key={key}
              onClick={() => setSection(key)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all active:scale-95 ${
                active
                  ? key === 'first_aid'
                    ? 'bg-error-500 text-white shadow-md shadow-error-500/25'
                    : 'bg-warning-500 text-white shadow-md shadow-warning-500/25'
                  : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {filtered.map((card, i) => (
          <InfoCard key={card.id} card={card} index={i} />
        ))}
      </div>
    </div>
  );
}
