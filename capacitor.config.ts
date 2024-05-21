import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'io.ionic.starter',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  android:{
    useLegacyBridge: true
  },
   plugins: {
    CapacitorHttp: {
        enabled: true,
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
  },

};

export default config;
