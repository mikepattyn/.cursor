import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.umbrella.example',
  appName: 'Example calculator',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
