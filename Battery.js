import Widget from "resource:///com/github/Aylur/ags/widget.js";
import Battery from "resource:///com/github/Aylur/ags/service/battery.js";

export const BatteryWidget = () =>
  Widget.Icon({
    className: "batteryIcon",
    binds: [
      ["visible", Battery, "available"],
      ["icon", Battery, "icon-name"],
      ["tooltip-text", Battery, "percent", (percent) => `${percent}%`],
    ],
  });
