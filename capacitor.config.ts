import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nour.adhkar',
  appName: 'نور',
  webDir: 'dist',
  plugins: {
    CapacitorUpdater: {
      appId: 'com.nour.adhkar',
      defaultChannel: 'production',
      autoUpdate: 'off',
      autoDeleteFailed: true,
      resetWhenUpdate: true,
    },
  },
};

export default config;
