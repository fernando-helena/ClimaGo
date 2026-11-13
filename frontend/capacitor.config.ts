import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.climago.app',
  appName: 'ClimaGo',
  webDir: 'www',
  android: {
    allowMixedContent: true
  }
};

export default config;
