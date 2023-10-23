import Gtk from "gi://Gtk";
import { Box, Window } from "resource:///com/github/Aylur/ags/widget.js";
import { exec } from "resource:///com/github/Aylur/ags/utils.js";

const CalendarWidget = () =>
  Box({
    className: "container",
    children: [
      new Gtk.Calendar({
        sensitive: false,
      }),
    ],
    connections: [
      [300000, (self) => {
        const calendar = self.children[0];
        calendar.day = exec("date +%d");
        calendar.month = exec("date +%m") - 1;
        calendar.year = exec("date +%Y");
      }],
    ],
  });

export const Calendar = ({ monitor }) =>
  Window({
    name: `calendar-${monitor}`,
    monitor,
    anchor: ["bottom", "right"],
    exclusive: false,
    child: CalendarWidget(),
    popup: true,
    visible: false,
    layer: "overlay",
    margin: [5],
  });
