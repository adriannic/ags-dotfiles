import Settings from "./settings.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import { execAsync, timeout } from "resource:///com/github/Aylur/ags/utils.js";

function showWidget(widget) {
  widget._hovered = true;

  widget.child.children[0].revealChild = widget._hovered;
  timeout(
    Settings.ANIMATION_SPEED_IN_MILLIS,
    () => widget.child.children[0].child.revealChild = widget._hovered,
  );
}

function hideWidget(widget) {
  widget._hovered = false;

  widget.child.children[0].child.revealChild = widget._hovered;
  timeout(
    Settings.ANIMATION_SPEED_IN_MILLIS,
    () => widget.child.children[0].revealChild = widget._hovered,
  );
}

export const Clock = () =>
  Widget.EventBox({
    aboveChild: true,
    onHover: showWidget,
    onHoverLost: hideWidget,
    properties: [["hovered", false]],
    child: Widget.Box({
      className: "container",
      vertical: true,
      children: [
        Widget.Revealer({
          revealChild: false,
          transition: "slide_left",
          transitionDuration: Settings.ANIMATION_SPEED_IN_MILLIS,
          child: Widget.Revealer({
            revealChild: false,
            transition: "slide_up",
            transitionDuration: Settings.ANIMATION_SPEED_IN_MILLIS,
            child: Widget.Calendar({
              sensitive: false,
            }),
          }),
        }),
        Widget.Label({ css: "padding: 0px 4px; min-height: 30px;" }),
      ],
      connections: [
        [1000, (widget) =>
          execAsync(["date", "+%H:%M"]).then((date) =>
            widget.children[1].label = date
          )],
      ],
    }),
  });
