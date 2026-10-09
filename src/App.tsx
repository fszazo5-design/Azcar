import { useEffect } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { AdhkarView } from '@/views/AdhkarView';
import { DuasView } from '@/views/DuasView';
import { LibraryView } from '@/views/LibraryView';
import { SettingsView } from '@/views/SettingsView';
import { QuranView } from '@/views/QuranView';

function MainContent() {
  const { tab } = useApp();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tab]);

  return (
    <main className="mx-auto min-h-[calc(100vh-56px-64px)] max-w-2xl pb-8">
      {tab === 'adhkar' && <AdhkarView />}
      {tab === 'quran' && <QuranView />}
      {tab === 'duas' && <DuasView />}
      {tab === 'library' && <LibraryView />}
      {tab === 'settings' && <SettingsView />}
    </main>
  );
}

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50 transition-colors dark:bg-gray-950">
        <Header />
        <MainContent />
        <BottomNav />
      </div>
    </AppProvider>
  );
}

export default App;
