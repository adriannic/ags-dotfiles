const { Label, Window, CenterBox, Box, Button, Icon } = ags.Widget;
const { Hyprland, SystemTray } = ags.Service;
import Gtk from "gi://Gtk";

const CalendarWidget = () => Box({
  className: "container",
  children: [
    new Gtk.Calendar({
      sensitive: false,
    }),
  ],
  connections: [
    [300000, self => {
      const calendar = self.children[0];
      calendar.day = ags.Utils.exec("date +%d");
      calendar.month = ags.Utils.exec("date +%m") - 1;
      calendar.year = ags.Utils.exec("date +%Y");
    }]
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
    layer: "overlay",
    margin: [5],
  });
