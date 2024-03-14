import { Bar, Spacer } from "./Bar.js";

const css = App.configDir + "/style.css";

App.config({
  style: css,
  windows: JSON.parse(Utils.exec("hyprctl monitors -j")).flatMap((monitor) => [
    Bar({ monitor: monitor.id }),
    Spacer({ monitor: monitor.id }),
  ]),
});
