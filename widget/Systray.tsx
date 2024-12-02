import Battery from "gi://AstalBattery";
import SystemTray from "gi://AstalTray";
import { bind } from "astal";
import { App, Gdk } from "astal/gtk3";
import { Icon } from "astal/gtk3/widget";

function SysTrayItem(item: SystemTray.TrayItem) {
  if (item.iconThemePath) {
    App.add_icons(item.iconThemePath);
  }

  const menu = item.create_menu();

  return <button
    tooltipMarkup={bind(item, "tooltipMarkup")}
    onDestroy={() => menu?.destroy()}
    onClickRelease={self => menu?.popup_at_widget(self, Gdk.Gravity.SOUTH, Gdk.Gravity.NORTH, null)}
  >
    <icon gIcon={bind(item, "gicon")} />
  </button>;
}
function BatteryWidget() {
  const battery = Battery.get_default();

  const update_icon = (self: Icon) => {
    // If there's no battery return
    if (battery.device_type !== Battery.Type.BATTERY || battery.power_supply !== true)
      return;

    const charging = battery.charging;
    const percent = String(Math.round(battery.percentage * 100)).padStart(3, '0');
    self.icon = `battery-${percent}${charging ? "-charging" : ""}`;
  };

  return <icon
    className="batteryIcon"
    visible
    icon={"battery-missing"}
    tooltipText={bind(battery, "percentage").as((percent) => `${Math.round(percent * 100)}%`)}
    setup={self => {
      update_icon(self);
      self.hook(bind(battery, "percentage"), update_icon);
      self.hook(bind(battery, "charging"), update_icon);
    }} />;
}
export function Systray() {
  const tray = SystemTray.get_default();
  return <box className="container">
    {bind(tray, "items").as((items) => {
      items = items.filter(item => item.gicon);
      const trayItems = items.map((item) => SysTrayItem(item));
      const trayWidgets = [BatteryWidget()];
      return [...trayItems, ...trayWidgets];
    })}
  </box>;
}

