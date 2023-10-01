const { Label, Window, CenterBox, Box, Button, Icon } = ags.Widget;
const { Hyprland, SystemTray } = ags.Service;

const CalendarWidget = () =>
  Box({
    className: "container",
    children: [
      Label({
        connections: [
          [3600000, (label) =>
            ags.Utils.execAsync(["date"]).then((date) =>
              label.label = date
            ).catch(console.error)],
        ],
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
  });
