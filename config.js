import App from "resource:///com/github/Aylur/ags/app.js";
import { Bar } from "./bar.js";
import { Calendar } from "./calendar.js";
import { Dashboard } from "./dashboard.js";
import { exec } from "resource:///com/github/Aylur/ags/utils.js";

const css = App.configDir + "/style.css";

export default {
  closeWindowDelay: {},
  notificationPopupTimeout: 10000,
  cacheNotificationActions: false,
  maxStreamVolume: 1.0,
  style: css,
  windows: JSON.parse(exec('bash -c "hyprctl monitors -j"')).flatMap(
    (
      mon,
    ) => [
      Bar({ monitor: mon.id }),
      Calendar({ monitor: mon.id }),
      Dashboard({ monitor: mon.id }),
    ],
  ),
};
