import Settings from "./settings.js";

export const SelectedOption = Variable("");

type OptionButton = {
  label: string;
  padding: number;
  command: string;
  monitor: number;
};

const OptionButton = ({ label, padding = 4, command, monitor }: OptionButton) =>
  Widget.Stack({
    transition: "over_right_left",
    transitionDuration: Settings.ANIMATION_SPEED_IN_MILLIS,
    shown: SelectedOption.bind().transform((item) =>
      item == `${label}-${monitor}` ? label : ""
    ),
    children: {
      "": Widget.Button({
        onPrimaryClick: () => SelectedOption.value = `${label}-${monitor}`,
        child: Widget.Label({
          label: label,
          css: `padding-right: ${padding}px;`,
        }),
      }),
      [label]: Widget.Button({
        onPrimaryClick: () => Utils.exec(command),
        onSecondaryClick: () => SelectedOption.value = "",
        child: Widget.Label({
          label: "",
          css: "padding-right: 4px;",
        }),
      }),
    },
  });

export const OptionsMenu = (monitor: number) =>
  Widget.Box({
    className: "container",
    css: "min-height: 100px",
    vertical: true,
    vpack: "end",
    children: [
      OptionButton({
        label: "",
        padding: 2,
        command: "systemctl reboot --boot-loader-entry=auto-windows",
        monitor,
      }),
      OptionButton({
        label: "󰍃",
        padding: 0,
        command: "hyprctl dispatch exit",
        monitor,
      }),
      OptionButton({
        label: "󰜉",
        padding: 1,
        command: "reboot",
        monitor,
      }),
      OptionButton({
        label: "",
        padding: 4,
        command: "shutdown now",
        monitor,
      }),
    ],
  });
