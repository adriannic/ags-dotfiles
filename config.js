import App from "resource:///com/github/Aylur/ags/app.js";
import { Bar, Spacer } from "./Bar.js";
import { exec } from "resource:///com/github/Aylur/ags/utils.js";

const css = App.configDir + "/style.css";

export default {
  closeWindowDelay: {},
  notificationPopupTimeout: 10000,
  cacheNotificationActions: false,
  maxStreamVolume: 1.0,
  style: css,
  windows: JSON.parse(exec("hyprctl monitors -j")).flatMap((monitor) => [
    Bar({ monitor: monitor.id }),
    Spacer({ monitor: monitor.id }),
  ]),
};
