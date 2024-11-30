import Battery from "gi://AstalBattery";
import SystemTray from "gi://AstalTray";
import { bind } from "astal";
import { App, Gdk } from "astal/gtk3";

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

  return <icon
    className="batteryIcon"
    visible={battery.device_type === Battery.Type.BATTERY && battery.power_supply === true}
    icon={bind(battery, "iconName")}
    tooltipText={bind(battery, "percentage").as((percent) => `${percent}%`)} />;
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

