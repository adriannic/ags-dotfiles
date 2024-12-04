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

  const to_breeze_dark = (icon: string) => `/usr/share/icons/breeze-dark/status/16/${icon}.svg`;

  const update_icon = (self: Icon) => {
    // If there's no battery return
    if (battery.device_type !== Battery.Type.BATTERY || battery.power_supply !== true)
      return;

    const charging = battery.charging;
    const percent = String(Math.round(battery.percentage * 10)).padStart(2, '0');
    self.icon = to_breeze_dark(`battery-${percent}0${charging ? "-charging" : ""}`);
  };

  return <icon
    className="batteryIcon"
    visible
    icon={to_breeze_dark("battery-missing")}
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

