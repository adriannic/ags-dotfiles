import App from "resource:///com/github/Aylur/ags/app.js";
import Audio from "resource:///com/github/Aylur/ags/service/audio.js";
import Battery from "resource:///com/github/Aylur/ags/service/battery.js";
import Hyprland from "resource:///com/github/Aylur/ags/service/hyprland.js";
import SystemTray from "resource:///com/github/Aylur/ags/service/systemtray.js";
import {
  Box,
  Button,
  CenterBox,
  EventBox,
  Icon,
  Label,
  Stack,
  Window,
} from "resource:///com/github/Aylur/ags/widget.js";
import { exec, execAsync } from "resource:///com/github/Aylur/ags/utils.js";

const AppMenuButton = ({ monitor }) =>
  Box({
    className: "container",
    halign: "start",
    children: [
      Button({
        onClicked: () =>
          execAsync(["bash", "-c", "killall wofi || wofi"]).catch(
            () => { },
          ),
        child: Icon({
          icon: "start-here-archlinux",
          size: 30,
        }),
      }),
    ],
  });

export const workspaces = [
  { "icon": "", "index": 1 },
  { "icon": "", "index": 2 },
  { "icon": "", "index": 3 },
  { "icon": "󰈹", "index": 4 },
  { "icon": "", "index": 5 },
  { "icon": "󰙯", "index": 6 },
  { "icon": "", "index": 7 },
  { "icon": "", "index": 8 },
];

const Workspaces = ({ monitor }) =>
  Box({
    className: "container",
    halign: "start",
    children: workspaces.map((workspace) =>
      Button({
        onClicked:
          `bash -c "~/.config/hypr/scripts/workspaces ${workspace.index}"`,
        child: Box({
          children: [
            Label({
              justification: "center",
              label: workspace.icon,
              connections: [
                [Hyprland, (label) =>
                  label.className = Hyprland.monitors.map((mon) =>
                    mon.activeWorkspace
                  )[monitor].id === workspace.index
                    ? "active-workspace"
                    : "workspace"],
              ],
            }),
          ],
        }),
      })
    ),
  });

const batteryIcons = {
  Charging: "󰂄",
  Discharging: ["󰂎", "󰁺", "󰁻", "󰁼", "󰁽", "󰁾", "󰁿", "󰂀", "󰂁", "󰂂", "󰁹"],
};

const BatteryIndicator = () =>
  EventBox({
    child: Stack({
      transition: "slide_up_down",
      items: [
        [
          "icon",
          Label({
            className: "text",
            style: "min-width: 40px;",
            label: "",
            connections: [[
              Battery,
              (self) =>
                self.label = Battery.charging
                  ? batteryIcons.Charging
                  : `${batteryIcons.Discharging[Math.floor(Battery.percent / 10)]
                  }`,
            ]],
          }),
        ],
        [
          "value",
          Label({
            className: "text",
            style: "font-size: 15px;",
            connections: [[
              Battery,
              (self) => self.label = `${Battery.percent}%`,
            ]],
          }),
        ],
      ],
    }),
    onHover: (widget) => widget.child.shown = "value",
    onHoverLost: (widget) => widget.child.shown = "icon",
    binds: [
      ["visible", Battery, "available"],
    ],
  });

const BrightnessIndicator = () =>
  EventBox({
    child: Stack({
      transition: "slide_up_down",
      items: [
        [
          "icon",
          Label({
            className: "text",
            style: "min-width: 40px;",
            label: "󰃟",
          }),
        ],
        [
          "value",
          Label({
            className: "text",
            style: "font-size: 15px;",
            connections: [
              [
                250,
                (self) => {
                  const current = exec("brightnessctl g");
                  const max = exec("brightnessctl m");
                  self.label = `${Math.ceil(current / max * 100)}%`;
                },
              ],
            ],
          }),
        ],
      ],
    }),
    onHover: (widget) => widget.child.shown = "value",
    onHoverLost: (widget) => widget.child.shown = "icon",
    onScrollUp: () =>
      exec(
        "bash -c 'brightnessctl set 5%+ && swayosd-client --brightness 0'",
      ),
    onScrollDown: () =>
      exec(
        "bash -c 'brightnessctl set 5%- && swayosd-client --brightness 0'",
      ),
  });

const volumeIcons = {
  muted: "󰖁",
  volume: ["󰕿", "󰖀", "󰕾", "󰕾"],
};

const VolumeIndicator = () =>
  EventBox({
    child: Stack({
      transition: "slide_up_down",
      items: [
        [
          "icon",
          Label({
            className: "text",
            style: "min-width: 40px;",
            connections: [
              [Audio, (self) => {
                self.label = Audio.speaker.isMuted
                  ? volumeIcons.muted
                  : volumeIcons.volume[Math.ceil(Audio.speaker.volume * 3)];
              }, "speaker-changed"],
            ],
          }),
        ],
        [
          "value",
          Label({
            className: "text",
            style: "font-size: 15px;",
            connections: [
              [Audio, (self) => {
                self.label = `${Math.ceil(Audio.speaker.volume * 100)}%`;
              }, "speaker-changed"],
            ],
          }),
        ],
      ],
    }),
    onHover: (widget) => widget.child.shown = "value",
    onHoverLost: (widget) => widget.child.shown = "icon",
    onScrollUp: () => exec("swayosd-client --output-volume raise"),
    onScrollDown: () => exec("swayosd-client --output-volume lower"),
    onPrimaryClick: () => exec("swayosd-client --output-volume mute-toggle"),
  });

const MicIndicator = () =>
  EventBox({
    child: Stack({
      transition: "slide_up_down",
      items: [
        [
          "icon",
          Label({
            className: "text",
            style: "min-width: 40px;",
            connections: [
              [Audio, (self) => {
                self.label = Audio.microphone.isMuted ? "󰍭" : "󰍬";
              }, "microphone-changed"],
            ],
          }),
        ],
        [
          "value",
          Label({
            className: "text",
            style: "font-size: 15px;",
            connections: [
              [Audio, (self) => {
                self.label = `${Math.ceil(Audio.microphone.volume * 100)}%`;
              }, "microphone-changed"],
            ],
          }),
        ],
      ],
    }),
    onHover: (widget) => widget.child.shown = "value",
    onHoverLost: (widget) => widget.child.shown = "icon",
    onScrollUp: () => exec("swayosd-client --input-volume raise"),
    onScrollDown: () => exec("swayosd-client --input-volume lower"),
    onPrimaryClick: () => exec("swayosd-client --input-volume mute-toggle"),
  });

const Utils = () =>
  Box({
    className: "container",
    halign: "end",
    children: [
      BatteryIndicator(),
      BrightnessIndicator(),
      VolumeIndicator(),
      MicIndicator(),
    ],
  });

const SysTray = () =>
  Box({
    className: "container",
    halign: "end",
    children: [],
    connections: [
      [SystemTray, (box) =>
        box.children = SystemTray.items.map((item) =>
          Button({
            onPrimaryClick: (_, event) => item.activate(event),
            onSecondaryClick: (_, event) => item.openMenu(event),
            child: Icon({
              size: 30,
            }),
            connections: [
              [item, (button) => {
                button.child.icon = item.icon;
                button.tooltipMarkup = item.tooltipMarkup;
              }],
            ],
          })
        ), "changed"],
    ],
  });

const Clock = ({ monitor }) =>
  Box({
    className: "container",
    halign: "center",
    children: [
      Button({
        onHover: () => App.openWindow(`calendar-${monitor}`),
        onHoverLost: () => App.closeWindow(`calendar-${monitor}`),
        child: Label({
          className: "clock",
          connections: [
            [
              5000,
              (label) =>
                execAsync(["date", "+%H:%M"]).then((time) => label.label = time)
                  .catch(console.error),
            ],
          ],
        }),
      }),
    ],
  });

const StartWidgets = ({ monitor }) =>
  Box({
    halign: "start",
    spacing: 4,
    children: [
      AppMenuButton({ monitor }),
      Workspaces({ monitor }),
    ],
  });

const CenterWidgets = ({ monitor }) =>
  Box({
    halign: "center",
    spacing: 4,
    children: [],
  });

const EndWidgets = ({ monitor }) =>
  Box({
    halign: "end",
    spacing: 4,
    children: [
      SysTray(),
      Utils(),
      Clock({ monitor }),
    ],
  });

export const Bar = ({ monitor } = {}) =>
  Window({
    name: `bar-${monitor}`,
    monitor,
    anchor: ["left", "bottom", "right"],
    exclusive: true,
    child: CenterBox({
      className: "bar",
      startWidget: StartWidgets({ monitor }),
      centerWidget: CenterWidgets({ monitor }),
      endWidget: EndWidgets({ monitor }),
    }),
  });
