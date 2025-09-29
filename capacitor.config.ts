import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tranogasy.app',
  appName: 'TranoGasy',
  webDir: 'build',
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      style: "LIGHT",
      backgroundColor: "#ffffffff",
    },
  },
};

export default config;
