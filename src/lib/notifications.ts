interface ScheduledNotification {
  id: string;
  hour: number;
  minute: number;
  title: string;
  body: string;
}

function scheduleNextTimeout(notif: ScheduledNotification): number {
  const now = new Date();
  const next = new Date();
  next.setHours(notif.hour, notif.minute, 0, 0);
  if (next <= now) {
    next.setDate(next.getDate() + 1);
  }
  const ms = next.getTime() - now.getTime();
  return window.setTimeout(() => {
    fireNotification(notif);
    // Re-schedule for the next day
    scheduledTimeouts[notif.id] = scheduleNextTimeout(notif);
  }, ms);
}

const scheduledTimeouts: Record<string, number> = {};

async function fireNotification(notif: ScheduledNotification): Promise<void> {
  // Try the Web Notifications API first
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      const reg = await navigator.serviceWorker?.getRegistration();
      if (reg) {
        reg.showNotification(notif.title, {
          body: notif.body,
          icon: '/vite.svg',
          tag: notif.id,
        } as NotificationOptions);
        return;
      }
    } catch {
      // fall through to plain Notification
    }
    new Notification(notif.title, {
      body: notif.body,
      icon: '/vite.svg',
      tag: notif.id,
    });
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function scheduleNotification(notif: ScheduledNotification): void {
  // Cancel existing for this id
  cancelNotification(notif.id);
  scheduledTimeouts[notif.id] = scheduleNextTimeout(notif);
}

export function cancelNotification(id: string): void {
  if (scheduledTimeouts[id]) {
    clearTimeout(scheduledTimeouts[id]);
    delete scheduledTimeouts[id];
  }
}

export function parseTimeString(time: string): { hour: number; minute: number } {
  const [h, m] = time.split(':').map((n) => parseInt(n, 10));
  return { hour: h || 0, minute: m || 0 };
}
