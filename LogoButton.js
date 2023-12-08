import Widget from "resource:///com/github/Aylur/ags/widget.js";
import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";
import { lookUpIcon } from "resource:///com/github/Aylur/ags/utils.js";

export const LogoButton = () =>
  Widget.Box({
    vertical: true,
    vpack: "end",
    children: [
      Widget.Button({
        className: "container",
        onPrimaryClick: () =>
          execAsync(["bash", "-c", "killall wofi || wofi"]).then(() => { })
            .catch(console.error),
        child: lookUpIcon("start-here-archlinux")
          ? Widget.Icon({ icon: "start-here-archlinux", size: 21 })
          : Widget.Label({ label: "", style: "padding-right: 6px;" }),
      }),
    ],
  });
