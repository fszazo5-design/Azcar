import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

interface ScheduledNotification {
  id: 'morning' | 'evening';
  hour: number;
  minute: number;
  title: string;
  body: string;
}

const nativeNotificationIds: Record<ScheduledNotification['id'], number> = {
  morning: 101,
  evening: 102,
};
const scheduledTimeouts: Partial<Record<ScheduledNotification['id'], number>> = {};

function scheduleNextTimeout(notif: ScheduledNotification): number {
  const now = new Date();
  const next = new Date();
  next.setHours(notif.hour, notif.minute, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);

  return window.setTimeout(() => {
    void fireWebNotification(notif);
    scheduledTimeouts[notif.id] = scheduleNextTimeout(notif);
  }, next.getTime() - now.getTime());
}

async function fireWebNotification(notif: ScheduledNotification): Promise<void> {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    const registration = await navigator.serviceWorker?.getRegistration();
    if (registration) {
      await registration.showNotification(notif.title, {
        body: notif.body,
        icon: '/noor-icon.svg',
        tag: notif.id,
      });
      return;
    }
  } catch {
    // Fall back to the browser notification API.
  }
  new Notification(notif.title, {
    body: notif.body,
    icon: '/noor-icon.svg',
    tag: notif.id,
  });
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (Capacitor.isNativePlatform()) {
    try {
      const current = await LocalNotifications.checkPermissions();
      const result = current.display === 'granted'
        ? current
        : await LocalNotifications.requestPermissions();
      return result.display === 'granted';
    } catch {
      return false;
    }
  }

  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  return (await Notification.requestPermission()) === 'granted';
}

export function scheduleNotification(notif: ScheduledNotification): void {
  cancelNotification(notif.id);

  if (Capacitor.isNativePlatform()) {
    const at = new Date();
    at.setHours(notif.hour, notif.minute, 0, 0);
    if (at <= new Date()) at.setDate(at.getDate() + 1);

    void LocalNotifications.schedule({
      notifications: [{
        id: nativeNotificationIds[notif.id],
        title: notif.title,
        body: notif.body,
        schedule: { at, repeats: true },
      }],
    }).catch((error: unknown) => {
      console.error('Failed to schedule local notification', error);
    });
    return;
  }

  scheduledTimeouts[notif.id] = scheduleNextTimeout(notif);
}

export function cancelNotification(id: ScheduledNotification['id']): void {
  const timeout = scheduledTimeouts[id];
  if (timeout !== undefined) {
    window.clearTimeout(timeout);
    delete scheduledTimeouts[id];
  }

  if (Capacitor.isNativePlatform()) {
    void LocalNotifications.cancel({
      notifications: [{ id: nativeNotificationIds[id] }],
    }).catch((error: unknown) => {
      console.error('Failed to cancel local notification', error);
    });
  }
}

export function parseTimeString(time: string): { hour: number; minute: number } {
  const [hour, minute] = time.split(':').map((part) => Number.parseInt(part, 10));
  return { hour: Number.isFinite(hour) ? hour : 0, minute: Number.isFinite(minute) ? minute : 0 };
}
