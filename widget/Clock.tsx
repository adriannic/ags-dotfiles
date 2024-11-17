import { Gtk } from "astal/gtk3"
import { Variable } from "../../../../../usr/share/astal/gjs";
import Settings from "./Settings";

const Time = Variable("00:00:00").poll(1000, "date +%T");
const Date = Variable("01/01/70").poll(1000, "date +%d/%m/%g");
export function Clock() {
  const Shown = Variable("time");

  return <button
    className="container"
    onClick={() => Shown.set(Shown.get() === "time" ? "date" : "time")}
    css="padding: 0px 4px;"
  >
    <stack
      transitionType={Gtk.StackTransitionType.SLIDE_UP_DOWN}
      transitionDuration={Settings.ANIMATION_SPEED_IN_MILLIS}
      shown={Shown()}
    >
      <label name="time" label={Time()}></label>
      <label name="date" label={Date()}></label>
    </stack>
  </button>;
}

