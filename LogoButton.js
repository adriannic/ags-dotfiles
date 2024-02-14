import Settings from "./settings.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import { OptionsMenu, SelectedOption } from "./PowerMenu.js";
import { SelectedMenu } from "./Bar.js";

export const LogoButton = ({ monitor }) =>
  Widget.Box({
    vertical: true,
    vpack: "end",
    spacing: 4,
    children: [
      Widget.Revealer({
        css: "min-height: 50px",
        revealChild: SelectedMenu.bind().transform((selected) =>
          selected === `powermenu-${monitor}`
        ),
        transitionDuration: Settings.ANIMATION_SPEED_IN_MILLIS,
        transition: "slide_up",
        child: OptionsMenu({ monitor }),
      }),
      Widget.Button({
        className: "container",
        onPrimaryClick: () => {
          SelectedOption.value = "";
          SelectedMenu.value = SelectedMenu.value === `powermenu-${monitor}`
            ? ""
            : `powermenu-${monitor}`;
        },
        child: Widget.Label({ label: "", css: "padding-right: 6px;" }),
      }),
    ],
  });
