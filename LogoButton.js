import Widget from "resource:///com/github/Aylur/ags/widget.js";
import { lookUpIcon } from "resource:///com/github/Aylur/ags/utils.js";

export const LogoButton = () =>
  Widget.Box({
    vertical: true,
    vpack: "end",
    children: [
      Widget.Button({
        className: "container",
        child: lookUpIcon("start-here-archlinux")
          ? Widget.Icon({ icon: "start-here-archlinux", size: 21 })
          : Widget.Label({ label: "", style: "padding-right: 6px;" }),
      }),
    ],
  });
