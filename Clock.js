import Settings from "./settings.js";
import Variable from "resource:///com/github/Aylur/ags/variable.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";

export const Time = Variable("00:00:00", {
  poll: [1000, "date +%T"],
});

export const Date = Variable("01/01/70", {
  poll: [1000, "date +%d/%m/%g"],
});

export const Clock = () =>
  Widget.Button({
    className: "container",
    onPrimaryClick: (self) =>
      self.child.shown = self.child.shown === "time" ? "date" : "time",
    css: "padding: 0px 4px;",
    child: Widget.Stack({
      transition: "slide_up_down",
      transitionDuration: Settings.ANIMATION_SPEED_IN_MILLIS,
      children: {
        "time": Widget.Label({ label: Time.bind() }),
        "date": Widget.Label({ label: Date.bind() }),
      },
    }),
  });
