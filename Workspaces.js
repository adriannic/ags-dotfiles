import Hyprland from "resource:///com/github/Aylur/ags/service/hyprland.js";
import Settings from "./settings.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import { execAsync, timeout } from "resource:///com/github/Aylur/ags/utils.js";

const workspaceList = [
  { name: "Principal", index: 1 },
  { name: "Secundario", index: 2 },
  { name: "Juegos", index: 3 },
  { name: "Navegador", index: 4 },
  { name: "Telegram", index: 5 },
  { name: "Discord", index: 6 },
  { name: "Whatsapp", index: 7 },
  { name: "Spotify", index: 8 },
  { name: "Obs", index: 9 },
];

const WorkspaceButton = ({ ws }) =>
  Widget.Revealer({
    properties: [
      ["ws", ws],
    ],
    transition: "slide_down",
    revealChild: false,
    transitionDuration: Settings.ANIMATION_SPEED_IN_MILLIS,
    child: Widget.Box({
      children: [
        Widget.Label({ label: `${ws.index}`, css: "min-width: 30px;" }),
        Widget.Revealer({
          transition: "slide_right",
          revealChild: false,
          transitionDuration: Settings.ANIMATION_SPEED_IN_MILLIS,
          child: Widget.Label({ label: ws.name, css: "padding-right: 8px;" }),
        }),
      ],
    }),
  });

let selectedWorkspaces = [1, 2];

const updateWorkspaces = (widget, monitor) => {
  execAsync(["hyprctl", "monitors", "-j"]).then((output) => {
    selectedWorkspaces = JSON.parse(output).map((mon) =>
      mon.activeWorkspace.id
    );
  }).catch(console.error);
  widget.child.children.forEach((ws) => {
    ws.revealChild = widget._hovered ||
      selectedWorkspaces[monitor] === ws._ws.index;
    ws.child.children[1].revealChild = widget._hovered;
  });
};

export const Workspaces = ({ monitor }) =>
  Widget.EventBox({
    aboveChild: true,
    onHover: (widget) => {
      widget._hovered = true;

      widget.child.children.forEach((ws) => {
        ws.revealChild = widget._hovered ||
          selectedWorkspaces[monitor] === ws._ws.index;
        timeout(Settings.ANIMATION_SPEED_IN_MILLIS, () => {
          ws.child.children[1].revealChild = widget._hovered;
        });
      });
    },
    onHoverLost: (widget) => {
      widget._hovered = false;

      widget.child.children.forEach((ws) => {
        timeout(Settings.ANIMATION_SPEED_IN_MILLIS, () => {
          ws.revealChild = widget._hovered ||
            selectedWorkspaces[monitor] === ws._ws.index;
        });
        ws.child.children[1].revealChild = widget._hovered;
      });
    },
    child: Widget.Box({
      className: "container",
      vertical: true,
      children: workspaceList.map((ws) => WorkspaceButton({ ws })),
    }),
    properties: [
      ["hovered", false],
    ],
    connections: [
      [Hyprland, (widget) => updateWorkspaces(widget, monitor)],
    ],
  });
