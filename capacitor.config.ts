import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wifipasscrack.app',
  appName: 'WiFi Pass Crack',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
