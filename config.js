import { Bar } from "./bar.js";

const css = ags.App.configDir + "/style.css";

export default {
  closeWindowDelay: {},
  notificationPopupTimeout: 10000,
  cacheNotificationActions: false,
  maxStreamVolume: 1.0,
  style: css,
  windows: [
    Bar({
      monitor: 0,
    }),
    Bar({
      monitor: 1,
    }),
  ],
};
