import Settings from "./settings.js";
import Variable from "resource:///com/github/Aylur/ags/variable.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import { exec } from "resource:///com/github/Aylur/ags/utils.js";

export const SelectedOption = Variable("");

const OptionButton = ({ label, padding = 4, command, monitor }) =>
  Widget.Box({
    children: [
      Widget.Stack({
        transition: "over_right_left",
        transitionDuration: Settings.ANIMATION_SPEED_IN_MILLIS,
        shown: SelectedOption.bind().transform((item) =>
          item === `${label}-${monitor}` ? label : ""
        ),
        items: [
          [
            "",
            Widget.Button({
              onPrimaryClick: () =>
                SelectedOption.value = `${label}-${monitor}`,
              child: Widget.Label({
                label: label,
                css: `padding-right: ${padding}px;`,
              }),
            }),
          ],
          [
            label,
            Widget.Button({
              onPrimaryClick: () => exec(command),
              onSecondaryClick: () => SelectedOption.value = "",
              child: Widget.Label({
                label: "",
                css: "padding-right: 4px;",
              }),
            }),
          ],
        ],
      }),
    ],
  });

export const OptionsMenu = ({ monitor }) =>
  Widget.Box({
    className: "container",
    vertical: true,
    valign: "end",
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
