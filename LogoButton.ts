import Settings from "./settings.js";
import { OptionsMenu, SelectedOption } from "./PowerMenu.js";
import { SelectedMenu } from "./Bar.js";

const os: string = Utils.exec(
  "bash -c 'grep -e ^ID /etc/os-release | cut -c 4-'",
);

const osLogos = {
  arch: "",
  nixos: "",
};

export const LogoButton = (monitor: number) =>
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
        child: OptionsMenu(monitor),
      }),
      Widget.Button({
        className: "container",
        onPrimaryClick: () => {
          SelectedOption.value = "";
          SelectedMenu.value = SelectedMenu.value === `powermenu-${monitor}`
            ? ""
            : `powermenu-${monitor}`;
        },
        child: Widget.Label({
          label: osLogos[os as keyof typeof osLogos],
          css: "padding-right: 6px;",
        }),
      }),
    ],
  });
