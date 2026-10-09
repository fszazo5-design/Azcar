import { useState } from 'react';
import { Bell, Moon, Sun, Type, Clock, Vibrate, Info, ChevronLeft, RefreshCw, Download, Check } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { CapacitorUpdater } from '@capgo/capacitor-updater';
import { useApp } from '@/context/AppContext';
import { requestNotificationPermission } from '@/lib/notifications';
import { vibrateClick } from '@/lib/vibrate';

interface ToggleProps {
  enabled: boolean;
  onChange: (v: boolean) => void;
}

function Toggle({ enabled, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => {
        vibrateClick();
        onChange(!enabled);
      }}
      className={`relative h-7 w-12 rounded-full transition-colors ${
        enabled ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-all ${
          enabled ? 'left-1' : 'left-6'
        }`}
      />
    </button>
  );
}

interface SectionProps {
  title: string;
  icon: typeof Bell;
  children: React.ReactNode;
}

function Section({ title, icon: Icon, children }: SectionProps) {
  return (
    <div className="card mb-3 animate-fadeUp">
      <div className="mb-3 flex items-center gap-2">
        <Icon size={18} className="text-primary-600 dark:text-primary-400" />
        <h2 className="font-bold text-gray-800 dark:text-gray-100">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export function SettingsView() {
  const { settings, updateSettings } = useApp();
  const [permStatus, setPermStatus] = useState<string>('');
  const [otaBusy, setOtaBusy] = useState(false);
  const [otaMessage, setOtaMessage] = useState('');
  const [latestBundle, setLatestBundle] = useState<Awaited<ReturnType<typeof CapacitorUpdater.getLatest>> | null>(null);
  const [downloadedBundle, setDownloadedBundle] = useState<{ id: string; version: string } | null>(null);

  const checkForOtaUpdate = async () => {
    if (!Capacitor.isNativePlatform()) {
      setOtaMessage('التحديث الهوائي متاح في نسخة Android المثبّتة فقط.');
      return;
    }

    setOtaBusy(true);
    setOtaMessage('جارٍ التحقق من التحديثات…');
    setLatestBundle(null);
    setDownloadedBundle(null);
    try {
      const latest = await CapacitorUpdater.getLatest();
      if (latest.kind === 'up_to_date' || latest.error === 'no_new_version_available') {
        setOtaMessage('التطبيق محدّث إلى آخر إصدار.');
      } else if (latest.kind === 'blocked') {
        setOtaMessage('هذا التحديث غير متوافق مع نسخة التطبيق الحالية.');
      } else if (!latest.url) {
        setOtaMessage('تعذّر العثور على حزمة تحديث صالحة. حاول لاحقًا.');
      } else {
        setLatestBundle(latest);
        setOtaMessage(`يتوفر تحديث جديد: ${latest.version}`);
      }
    } catch {
      setOtaMessage('تعذّر الاتصال بخدمة التحديث. تحقّق من الإنترنت ثم أعد المحاولة.');
    } finally {
      setOtaBusy(false);
    }
  };

  const downloadOtaUpdate = async () => {
    if (!latestBundle?.url) return;
    setOtaBusy(true);
    setOtaMessage('جارٍ تنزيل التحديث…');
    try {
      const bundle = await CapacitorUpdater.download({
        url: latestBundle.url,
        version: latestBundle.version,
        checksum: latestBundle.checksum,
        sessionKey: latestBundle.sessionKey,
        manifest: latestBundle.manifest,
      });
      setDownloadedBundle({ id: bundle.id, version: bundle.version });
      setLatestBundle(null);
      setOtaMessage(`اكتمل تنزيل الإصدار ${bundle.version}. يمكنك تثبيته الآن.`);
    } catch {
      setOtaMessage('فشل تنزيل التحديث. تحقّق من الاتصال ثم حاول مجددًا.');
    } finally {
      setOtaBusy(false);
    }
  };

  const applyOtaUpdate = async () => {
    if (!downloadedBundle) return;
    setOtaBusy(true);
    setOtaMessage('جارٍ تثبيت التحديث وإعادة تشغيل التطبيق…');
    try {
      await CapacitorUpdater.set({ id: downloadedBundle.id });
    } catch {
      setOtaBusy(false);
      setOtaMessage('تعذّر تطبيق التحديث. سيبقى الإصدار الحالي كما هو.');
    }
  };

  const handleNotifToggle = async (key: 'morningNotification' | 'eveningNotification', value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        setPermStatus('لم يتم منح إذن الإشعارات. فعّلها من إعدادات المتصفح');
        return;
      }
      setPermStatus('');
    }
    updateSettings({ [key]: value });
  };

  const fontSizes = [
    { scale: 0.85, label: 'صغير' },
    { scale: 1, label: 'عادي' },
    { scale: 1.2, label: 'كبير' },
    { scale: 1.45, label: 'كبير جداً' },
  ];

  return (
    <div className="px-4 py-4">
      {/* Appearance */}
      <Section title="المظهر" icon={Sun}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            {settings.theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            الوضع الداكن
          </div>
          <Toggle
            enabled={settings.theme === 'dark'}
            onChange={(v) => updateSettings({ theme: v ? 'dark' : 'light' })}
          />
        </div>

        <div className="border-t border-gray-100 pt-3 dark:border-gray-700/50">
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Type size={18} />
            حجم الخط
          </div>
          <div className="flex gap-2">
            {fontSizes.map((f) => (
              <button
                key={f.scale}
                onClick={() => {
                  vibrateClick();
                  updateSettings({ fontScale: f.scale });
                }}
                className={`flex-1 rounded-xl py-2 text-sm font-medium transition-all active:scale-95 ${
                  settings.fontScale === f.scale
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* Notifications */}
      <Section title="التنبيهات" icon={Bell}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Sun size={18} />
              تنبيه أذكار الصباح
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <Clock size={14} className="text-gray-400" />
              <input
                type="time"
                value={settings.morningTime}
                onChange={(e) => updateSettings({ morningTime: e.target.value })}
                className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              />
            </div>
          </div>
          <Toggle
            enabled={settings.morningNotification}
            onChange={(v) => handleNotifToggle('morningNotification', v)}
          />
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700/50">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Moon size={18} />
              تنبيه أذكار المساء
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <Clock size={14} className="text-gray-400" />
              <input
                type="time"
                value={settings.eveningTime}
                onChange={(e) => updateSettings({ eveningTime: e.target.value })}
                className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              />
            </div>
          </div>
          <Toggle
            enabled={settings.eveningNotification}
            onChange={(v) => handleNotifToggle('eveningNotification', v)}
          />
        </div>

        {permStatus && (
          <p className="mt-3 rounded-lg bg-warning-50 px-3 py-2 text-xs text-warning-700 dark:bg-warning-500/10 dark:text-warning-400">
            {permStatus}
          </p>
        )}
      </Section>

      {/* Over-the-air updates */}
      <Section title="التحديث الهوائي (OTA)" icon={RefreshCw}>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
          <p>تحقّق من تحديثات التطبيق وثبّتها دون تنزيل ملف APK جديد.</p>
          <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 text-xs dark:bg-gray-700/40">
            <span className="flex items-center gap-2"><Download size={15} /> قناة التحديث</span>
            <span className="font-semibold text-primary-700 dark:text-primary-300">production</span>
          </div>

          {otaMessage && (
            <p role="status" aria-live="polite" className="rounded-lg bg-primary-50 px-3 py-2 text-xs text-primary-700 dark:bg-primary-900/20 dark:text-primary-300">
              {otaMessage}
            </p>
          )}

          {!downloadedBundle && (
            <button
              type="button"
              onClick={checkForOtaUpdate}
              disabled={otaBusy}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw size={17} className={otaBusy ? 'animate-spin' : ''} />
              {otaBusy ? 'يرجى الانتظار…' : 'التحقق من وجود تحديث'}
            </button>
          )}

          {latestBundle?.url && (
            <button
              type="button"
              onClick={downloadOtaUpdate}
              disabled={otaBusy}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download size={17} /> تنزيل الإصدار {latestBundle.version}
            </button>
          )}

          {downloadedBundle && (
            <button
              type="button"
              onClick={applyOtaUpdate}
              disabled={otaBusy}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Check size={17} /> تثبيت الإصدار {downloadedBundle.version} الآن
            </button>
          )}

          <p className="text-xs leading-relaxed text-gray-400">
            يتطلب التحديث اتصالًا بالإنترنت وإعداد خدمة Capgo. تغييرات Android الأصلية تحتاج تحديثًا جديدًا من المتجر.
          </p>
        </div>
      </Section>

      {/* About */}
      <Section title="حول التطبيق" icon={Info}>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center justify-between">
            <span>الإصدار</span>
            <span className="text-gray-400">1.0.1</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Vibrate size={16} />
              الاهتزاز
            </span>
            <span className="text-gray-400">مفعّل</span>
          </div>
          <div className="flex items-center justify-between">
            <span>التخزين</span>
            <span className="text-gray-400">محلي (IndexedDB)</span>
          </div>
          <div className="flex items-center justify-between">
            <span>الاتصال</span>
            <span className="text-gray-400">يعمل بدون إنترنت</span>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-primary-50 p-3 text-center text-xs text-primary-700 dark:bg-primary-900/20 dark:text-primary-300">
          ﴿ وَذْكُرِ اللَّهَ فَإِنَّهُ أَعْظَمُ ﴾
        </div>
      </Section>

      {/* Capacitor / APK instructions */}
      <div className="card animate-fadeUp">
        <h2 className="mb-3 font-bold text-gray-800 dark:text-gray-100">خطوات إنشاء ملف APK</h2>
        <div className="space-y-3 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
          <div className="flex gap-2">
            <ChevronLeft size={16} className="mt-0.5 shrink-0 text-primary-500" />
            <p>ثبّت Capacitor: <code className="rounded bg-gray-100 px-1 dark:bg-gray-700">npm install @capacitor/core @capacitor/cli @capacitor/android</code></p>
          </div>
          <div className="flex gap-2">
            <ChevronLeft size={16} className="mt-0.5 shrink-0 text-primary-500" />
            <p>أضف المنصة: <code className="rounded bg-gray-100 px-1 dark:bg-gray-700">npx cap init && npx cap add android</code></p>
          </div>
          <div className="flex gap-2">
            <ChevronLeft size={16} className="mt-0.5 shrink-0 text-primary-500" />
            <p>ابنِ المشروع: <code className="rounded bg-gray-100 px-1 dark:bg-gray-700">npm run build && npx cap copy</code></p>
          </div>
          <div className="flex gap-2">
            <ChevronLeft size={16} className="mt-0.5 shrink-0 text-primary-500" />
            <p>افتح Android Studio: <code className="rounded bg-gray-100 px-1 dark:bg-gray-700">npx cap open android</code></p>
          </div>
          <div className="flex gap-2">
            <ChevronLeft size={16} className="mt-0.5 shrink-0 text-primary-500" />
            <p>من Android Studio: Build → Build Bundle / APK → Build APK</p>
          </div>
          <div className="flex gap-2">
            <ChevronLeft size={16} className="mt-0.5 shrink-0 text-primary-500" />
            <p>للإشعارات المحلية في Android: <code className="rounded bg-gray-100 px-1 dark:bg-gray-700">npm install @capacitor/local-notifications</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}
