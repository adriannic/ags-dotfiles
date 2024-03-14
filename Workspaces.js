import Hyprland from "resource:///com/github/Aylur/ags/service/hyprland.js";
import Settings from "./settings.js";

const WorkspaceButton = ({ entry }) =>
  Widget.Button({
    onPrimaryClick: () =>
      Utils.exec(`bash -c '~/.config/hypr/scripts/workspaces ${entry.index}'`),
    tooltipText: entry.name,
    child: Widget.Label(`${entry.index}`),
  });

const IndicatorWidget = ({ monitor }) =>
  Widget.Box({
    children: [
      Widget.Box({
        hexpand: true,
        vexpand: true,
        className: "selectedWorkspace",
      }),
    ],
    setup: (self) =>
      self.hook(
        Hyprland,
        (self) => {
          const selectedWorkspace = Hyprland.monitors[monitor]
            ?.activeWorkspace.id;

          const marginLeft = (selectedWorkspace - 1) * 30;
          const marginRight =
            (Settings.workspaceList.length - selectedWorkspace) * 30;
          self.css = `
            margin-left: ${marginLeft}px;
            margin-right: ${marginRight}px;
            transition: margin ${Settings.ANIMATION_SPEED_IN_MILLIS}ms ease-in-out;`;
        },
      ),
  });

export const Workspaces = ({ monitor }) =>
  Widget.Box({
    vertical: true,
    vpack: "end",
    children: [
      Widget.Overlay({
        passThrough: true,
        child: Widget.Box({
          className: "container",
          children: Settings.workspaceList.map((entry) =>
            WorkspaceButton({ entry })
          ),
        }),
        overlays: [IndicatorWidget({ monitor })],
      }),
    ],
  });
