import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Example calculator',
  slug: 'umbrella-example',
  scheme: 'umbrella',
  version: '0.0.0',
  orientation: 'portrait',
  platforms: ['ios', 'android', 'web'],
  extra: {
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || '/api',
  },
};

export default config;
