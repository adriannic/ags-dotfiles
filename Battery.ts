import Battery from "resource:///com/github/Aylur/ags/service/battery.js";

export const BatteryWidget = () =>
  Widget.Icon({
    className: "batteryIcon",
    visible: Battery.bind("available"),
    icon: Battery.bind("icon_name"),
    tooltipText: Battery.bind("percent").transform((percent) => `${percent}%`),
  });
