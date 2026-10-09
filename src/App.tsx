import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { CapacitorUpdater } from '@capgo/capacitor-updater';
import { AppProvider, useApp } from '@/context/AppContext';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { AdhkarView } from '@/views/AdhkarView';
import { DuasView } from '@/views/DuasView';
import { LibraryView } from '@/views/LibraryView';
import { SettingsView } from '@/views/SettingsView';

function MainContent() {
  const { tab } = useApp();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tab]);

  return (
    <main className="mx-auto min-h-[calc(100vh-56px-64px)] max-w-2xl pb-8">
      {tab === 'adhkar' && <AdhkarView />}
      {tab === 'duas' && <DuasView />}
      {tab === 'library' && <LibraryView />}
      {tab === 'settings' && <SettingsView />}
    </main>
  );
}

function App() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    void CapacitorUpdater.notifyAppReady().catch(() => {
      // OTA is unavailable until a native build containing the plugin is installed.
    });
  }, []);

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
