import { Clock } from "./Clock.js";
import { LogoButton } from "./LogoButton.js";
import { Systray } from "./Systray.js";
import { Workspaces } from "./Workspaces.js";

export const SelectedMenu = Variable("");

const StartWidgets = (monitor: number) =>
  Widget.Box({
    spacing: 4,
    hpack: "start",
    vpack: "end",
    children: [
      LogoButton(monitor),
      Workspaces(monitor),
    ],
  });

const CenterWidgets = () => Widget.Box({});

const EndWidgets = () =>
  Widget.Box({
    spacing: 4,
    hpack: "end",
    vpack: "end",
    children: [
      Systray(),
      Clock(),
    ],
  });

export const Bar = (monitor: number) =>
  Widget.Window({
    className: "barWindow",
    name: `bar-${monitor}`,
    monitor,
    anchor: ["left", "bottom", "right"],
    margins: [-36, 0],
    layer: "bottom",
    child: Widget.CenterBox({
      className: "bar",
      startWidget: StartWidgets(monitor),
      centerWidget: CenterWidgets(),
      endWidget: EndWidgets(),
    }),
  });

export const Spacer = (monitor: number) =>
  Widget.Window({
    name: `spacer-${monitor}`,
    monitor,
    anchor: ["left", "bottom", "right"],
    layer: "background",
    exclusivity: "exclusive",
    child: Widget.Label({ label: "", css: "min-height: 36px;" }),
  });
