import Widget from "resource:///com/github/Aylur/ags/widget.js";
import SystemTray from "resource:///com/github/Aylur/ags/service/systemtray.js";
import { BatteryWidget } from "./Battery.js";

const SysTrayItem = ({ item }) =>
  Widget.Button({
    child: Widget.Icon({ binds: [["icon", item, "icon"]] }),
    binds: [["tooltip-markup", item, "tooltip-markup"]],
    onPrimaryClick: (_, event) => item.activate(event),
    onSecondaryClick: (_, event) => item.openMenu(event),
  });

export const Systray = () =>
  Widget.Box({
    vertical: true,
    vpack: "end",
    children: [
      Widget.Box({
        className: "container",
        binds: [["children", SystemTray, "items", (items) =>
          items.map((item) =>
            SysTrayItem({ item })
          ).concat([BatteryWidget()])]],
      }),
    ],
  });
