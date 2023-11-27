import Hyprland from "resource:///com/github/Aylur/ags/service/hyprland.js";
import Settings from "./settings.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";

let selectedWorkspaces = [1, 2];

const updateWorkspaces = () =>
  selectedWorkspaces = Hyprland.monitors.map((mon) => mon.activeWorkspace.id);

const changeWorkspace = (workspace) => {
  execAsync(["bash", "-c", `~/.config/hypr/scripts/workspaces ${workspace}`])
    .then(() => {}).catch(console.error);
  updateWorkspaces();
};

const WorkspaceButton = ({ entry }) =>
  Widget.Button({
    onPrimaryClick: () => changeWorkspace(entry.index),
    tooltipText: entry.name,
    child: Widget.Label(`${entry.index}`),
  });

export const Workspaces = ({ monitor }) =>
  Widget.Overlay({
    passThrough: true,
    child: Widget.Box({
      className: "container",
      children: Settings.workspaceList.map((entry) =>
        WorkspaceButton({ entry })
      ),
      connections: [[Hyprland, updateWorkspaces]],
    }),
    overlays: [
      Widget.Box({
        children: [
          Widget.Box({
            hexpand: true,
            vexpand: true,
            className: "selectedWorkspace",
          }),
        ],
        connections: [[
          300,
          (widget) => {
            widget.css = `
              margin-left: ${(selectedWorkspaces[monitor] - 1) * 30}px;
              margin-right: ${(8 - selectedWorkspaces[monitor] + 1) * 30}px;
              transition: margin ${Settings.ANIMATION_SPEED_IN_MILLIS}ms ease-in-out;`;
            widget.visible =
              selectedWorkspaces[monitor] <= Settings.workspaceList.length;
          },
        ]],
      }),
    ],
  });
