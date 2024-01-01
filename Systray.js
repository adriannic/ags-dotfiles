import SystemTray from "resource:///com/github/Aylur/ags/service/systemtray.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import { BatteryWidget } from "./Battery.js";

const SysTrayItem = ({ item }) =>
  Widget.Button({
    child: Widget.Icon({ binds: [["icon", item, "icon"]], size: 21 }),
    tooltipMarkup: item.bind("tooltip-markup"),
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
        children: SystemTray.bind("items").transform((items) =>
          items.map((item) => SysTrayItem({ item }))
            .concat([BatteryWidget()])
        ),
      }),
    ],
  });
