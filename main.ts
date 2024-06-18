import { Background } from "Background.js";
import { Bar, Spacer } from "./Bar.js";
import { Monitor } from "types/service/hyprland.js";

const css = App.configDir + "/style.css";

App.config({
  style: css,
  windows: JSON.parse(Utils.exec("hyprctl monitors -j")).flatMap((
    monitor: Monitor,
  ) => [
    Bar(monitor.id),
    Spacer(monitor.id),
    Background(monitor.id),
  ]),
});
