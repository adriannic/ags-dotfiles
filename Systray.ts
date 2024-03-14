import SystemTray from "resource:///com/github/Aylur/ags/service/systemtray.js";
import { BatteryWidget } from "./Battery.js";
import { TrayItem } from "types/service/systemtray.js";

const SysTrayItem = (item: TrayItem) =>
  Widget.Button({
    child: Widget.Icon({
      setup: (setup) => setup.bind("icon", item, "icon"),
      size: 21,
    }),
    tooltipMarkup: item.bind("tooltip_markup"),
    onPrimaryClick: (_, event) => item.activate(event),
    onSecondaryClick: (_, event) => item.openMenu(event),
  });

export const Systray = () =>
  Widget.Box({
    className: "container",
    children: SystemTray.bind("items").transform((items) => {
      const trayItems = items.map((item) => SysTrayItem(item));
      const trayWidgets = [BatteryWidget()];
      return [...trayItems, ...trayWidgets];
    }),
  });
