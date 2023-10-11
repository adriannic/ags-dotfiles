import { workspaces } from "./bar.js";
const {
  Widget,
  Label,
  Window,
  CenterBox,
  Box,
  Button,
  Icon,
  Overlay,
  EventBox,
} = ags.Widget;
const { Hyprland, SystemTray } = ags.Service;
import Gtk from "gi://Gtk";

const DesktopWindowWidget = ({ client }) =>
  Box({
    halign: "start",
    valign: "start",
    style: `margin-left: ${client.at[0] / 9}px;
            margin-top: ${client.at[1] / 8.475}px`,
    children: [
      Button({
        className: "container",
        sensitive: true,
        onPrimaryClick:
          `bash -c "~/.config/hypr/scripts/workspaces ${client.workspace.id}"`,
        style: `min-width: ${client.size[0] / 9}px;
                min-height: ${client.size[1] / 8.475}px;`, // not 9 to account for the bar's height
        child: Icon({
          icon: client.initialClass,
          size: 30,
        }),
      }),
    ],
    connections: [
      [Hyprland, (self) => {
        self.visible = client.title !== "";
      }],
    ],
  });

const DesktopWidget = ({ monitor, workspace }) =>
  Overlay({
    pass_through: true,
    halign: "center",
    valign: "start",
    child: Button({
      className: "WorkspaceWidget",
      sensitive: true,
      onPrimaryClick:
        `bash -c "~/.config/hypr/scripts/workspaces ${workspace.index}"`,
      child: Label({
        className: "WorkspaceWidgetIcon",
        label: workspace.icon,
      }),
      connections: [
        [Hyprland, (label) =>
          label.className = Hyprland.monitors.map((mon) =>
            mon.activeWorkspace
          )[monitor].id === workspace.index
            ? " SelectedWorkspaceWidget"
            : "WorkspaceWidget"],
      ],
    }),
    connections: [
      [Hyprland, (self) => {
        self.overlays = Hyprland.clients.filter((client) =>
          client.workspace.id === workspace.index
        ).map((client) =>
          DesktopWindowWidget({ client })
        );
      }],
    ],
  });

export const Dashboard = ({ monitor }) =>
  Window({
    name: `dashboard-${monitor}`,
    monitor,
    anchor: ["left", "right", "top", "bottom"],
    exclusive: false,
    layer: "overlay",
    popup: true,
    focusable: true,
    child: Box({
      className: "container",
      style: "padding: 18px; margin: 5px;",
      halign: "center",
      valign: "start",
      spacing: 18,
      children: workspaces.map((workspace) =>
        DesktopWidget({ monitor, workspace })
      ),
    }),
  });
