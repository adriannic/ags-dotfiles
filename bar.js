const { Label, Window, CenterBox, Box, Button, Icon, CircularProgress } =
  ags.Widget;
const { Hyprland, SystemTray, Battery, Audio } = ags.Service;

const AppMenuButton = ({ monitor }) =>
  Box({
    className: "container",
    halign: "start",
    children: [
      Button({
        onClicked: () =>
          ags.Utils.execAsync(["bash", "-c", "killall wofi || wofi"]).catch(
            () => { },
          ),
        child: Icon({
          icon: "start-here-archlinux",
          size: 30,
        }),
      }),
    ],
  });

const workspaces = [
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

const MicIndicator = () =>
  CircularProgress({
    className: "progress",
    inverted: true,
    rounded: false,
    startAt: 0.75,
    child: Label({
      style: "margin-left: 1px; margin-right: -1px;",
    }),
    connections: [
      [Audio, (self) => {
        self.value = Audio.microphone.volume;
        self.child.label = Audio.microphone["is-muted"] ? "󰍭" : "󰍬";
      }, "microphone-changed"],
    ],
  });

const volumeIcons = {
  muted: "󰖁",
  volume: ["󰕿", "󰖀", "󰕾", "󰕾"],
};

const VolumeIndicator = () =>
  CircularProgress({
    className: "progress",
    inverted: true,
    rounded: false,
    startAt: 0.75,
    child: Label({
      style: "margin-left: 1px; margin-right: -1px;",
    }),
    connections: [
      [Audio, (self) => {
        self.value = Audio.speaker.volume;
        self.child.label = Audio.speaker["is-muted"]
          ? volumeIcons.muted
          : volumeIcons.volume[Math.ceil(Audio.speaker.volume * 3)];
      }, "speaker-changed"],
    ],
  });

const BrightnessIndicator = () =>
  CircularProgress({
    className: "progress",
    inverted: true,
    rounded: false,
    startAt: 0.75,
    child: Label({
      style: "margin-left: 1px; margin-right: -1px;",
      label: "󰃟",
    }),
    connections: [
      [
        250,
        (self) => {
          const current = ags.Utils.exec("brightnessctl g");
          const max = ags.Utils.exec("brightnessctl m");
          self.value = current / max;
        },
      ],
    ],
  });

const batteryIcons = {
  Charging: "󰂄",
  Discharging: ["󰂎", "󰁺", "󰁻", "󰁼", "󰁽", "󰁾", "󰁿", "󰂀", "󰂁", "󰂂", "󰁹"],
};

const BatteryIndicator = () =>
  CircularProgress({
    className: "progress",
    inverted: false,
    rounded: false,
    startAt: 0.75,
    child: Label({
      style: "margin-left: 1px; margin-right: -1px;",
    }),
    connections: [
      [Battery, (self) => {
        self.value = 1 - Battery.percent / 100;
        self.className = Battery.charging ? "charging progress" : "progress";
        self.child.label = Battery.charging
          ? batteryIcons.Charging
          : batteryIcons.Discharging[Math.floor(Battery.percent / 10)];
      }],
    ],
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
        child: Label({
          className: "clock",
          connections: [
            [
              5000,
              (label) =>
                ags.Utils.execAsync(["date", "+%H:%M"]).then((time) =>
                  label.label = time
                )
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
    spacing: 5,
    children: [
      AppMenuButton({ monitor }),
      Workspaces({ monitor }),
    ],
  });

const CenterWidgets = ({ monitor }) =>
  Box({
    halign: "center",
    spacing: 5,
    children: [],
  });

const EndWidgets = ({ monitor }) =>
  Box({
    halign: "end",
    spacing: 5,
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
