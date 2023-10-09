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
