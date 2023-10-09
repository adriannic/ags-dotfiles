import { Bar } from "./bar.js";
import { Calendar } from "./calendar.js";
const { Hyprland } = ags.Service;

const css = ags.App.configDir + "/style.css";

export default {
  closeWindowDelay: {},
  notificationPopupTimeout: 10000,
  cacheNotificationActions: false,
  maxStreamVolume: 1.0,
  style: css,
  windows: JSON.parse(ags.Utils.exec('bash -c "hyprctl monitors -j"')).map(
    (mon) => Bar({ monitor: mon.id }),
  ).concat(
    JSON.parse(ags.Utils.exec('bash -c "hyprctl monitors -j"')).map(
      (mon) => Calendar({ monitor: mon.id }),
    ),
  ),
};
