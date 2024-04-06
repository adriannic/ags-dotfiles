const Hyprland = await Service.import("hyprland");

export const Background = (monitor: number) => Widget.Window({
  className: "backgroundWindow",
  name: `background-${monitor}`,
  layer: "background",
  monitor,
  anchor: ["left", "bottom", "right", "top"],
  child: Widget.EventBox({
    onSecondaryClickRelease: (_, event) => {
      const menu = Widget.Menu({
        children: [
          Widget.MenuItem({
            child: Widget.Label("Random Background"),
            onActivate: () => {
              Hyprland.messageAsync("dispatch exec ~/.config/wal/random-bg.sh");
            },
          }),
        ],
      });

      menu.popup_at_pointer(event);
    },
  }),
});
