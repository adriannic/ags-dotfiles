import Hyprland from "resource:///com/github/Aylur/ags/service/hyprland.js";
import Settings from "./settings.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import { execAsync, timeout } from "resource:///com/github/Aylur/ags/utils.js";

let selectedWorkspaces = [1, 2];

const updateWorkspaces = (monitor) =>
  execAsync("hyprctl monitors -j").then((output) => {
    selectedWorkspaces = JSON.parse(output).map((mon) =>
      mon.activeWorkspace.id
    );
  }).catch(console.error);

const changeWorkspace = (workspace) => {
  execAsync(["bash", "-c", `~/.config/hypr/scripts/workspaces ${workspace}`]).then(
    () => { },
  ).catch(console.error);
};

const WorkspaceButton = ({ entry, monitor }) =>
  Widget.Button({
    onPrimaryClick: () => changeWorkspace(entry.index),
    tooltipText: entry.name,
    child: Widget.Label({
      label: `${entry.index}`,
      connections: [[
        300,
        (widget) =>
          widget.toggleClassName(
            "selectedWorkspace",
            selectedWorkspaces[monitor] === entry.index,
          ),
      ]],
    }),
  });

export const Workspaces = ({ monitor }) =>
  Widget.Box({
    className: "container",
    children: Settings.workspaceList.flatMap((
      entry,
    ) => [WorkspaceButton({ entry, monitor })]),
    connections: [
      [300, () => updateWorkspaces(monitor)],
    ],
  });
