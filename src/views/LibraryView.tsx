import { useState } from 'react';
import { Stethoscope, Lightbulb, HeartPulse, ScrollText } from 'lucide-react';
import { libraryCards, librarySections } from '@/data/library';
import { InfoCard } from '@/components/InfoCard';
import type { LibraryCard } from '@/types';

type Section = LibraryCard['section'];

export function LibraryView() {
  const [section, setSection] = useState<Section>('first_aid');

  const filtered = libraryCards.filter((c) => c.section === section);

  const sections: { key: Section; label: string; icon: typeof Stethoscope; active: string }[] = [
    { key: 'first_aid', label: librarySections['first_aid'], icon: Stethoscope, active: 'bg-error-500 text-white shadow-md shadow-error-500/25' },
    { key: 'health', label: librarySections['health'], icon: HeartPulse, active: 'bg-success-600 text-white shadow-md shadow-success-500/25' },
    { key: 'religion', label: librarySections['religion'], icon: ScrollText, active: 'bg-primary-600 text-white shadow-md shadow-primary-500/25' },
    { key: 'wisdom', label: librarySections['wisdom'], icon: Lightbulb, active: 'bg-warning-500 text-white shadow-md shadow-warning-500/25' },
  ];

  return (
    <div className="px-4 py-4">
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">معلومات مختارة للتوعية، وليست بديلًا عن الطبيب أو المفتي.</p>
      {/* Section toggle */}
      <div className="mb-5 grid grid-cols-2 gap-2">
        {sections.map(({ key, label, icon: Icon, active: activeClass }) => {
          const active = section === key;
          return (
            <button
              key={key}
              onClick={() => setSection(key)}
              className={`flex items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-xs font-medium transition-all active:scale-95 ${
                active
                  ? activeClass
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
