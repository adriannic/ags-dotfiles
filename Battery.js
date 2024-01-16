import Battery from "resource:///com/github/Aylur/ags/service/battery.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";

export const BatteryWidget = () =>
  Widget.Icon({
    className: "batteryIcon",
    visible: Battery.bind("available"),
    icon: Battery.bind("icon-name"),
    tooltipText: Battery.bind("percent").transform((percent) => `${percent}%`),
  });
