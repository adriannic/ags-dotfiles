import SystemTray from "gi://AstalTray";
import { bind, Gio, Variable } from "astal";
import { App, Gdk, Gtk } from "astal/gtk3";
import { BatteryWidget } from "./BatteryWidget";

const createMenu = (menuModel: Gio.MenuModel, actionGroup: Gio.ActionGroup | null): Gtk.Menu => {
  const menu = Gtk.Menu.new_from_model(menuModel);
  menu.insert_action_group('dbusmenu', actionGroup);

  return menu;
};

function SysTrayItem(item: SystemTray.TrayItem) {
  if (item.iconThemePath) {
    App.add_icons(item.iconThemePath);
  }

  let menu: Gtk.Menu;

  const entryBinding = Variable.derive(
    [bind(item, 'menu-model' as any), bind(item, 'action-group' as any)],
    (menu_model: Gio.MenuModel, action_group: Gio.ActionGroup) => {
      if (!menu_model) {
        return console.error(`Menu Model not found for ${item.id}`);
      }
      if (!action_group) {
        return console.error(`Action Group not found for ${item.id}`);
      }

      menu = createMenu(menu_model, action_group);
    },
  );

  return <button
    tooltipMarkup={bind(item, "tooltipMarkup")}
    onDestroy={() => menu?.destroy()}
    onClickRelease={(self, event) => {
      if (event.button === Gdk.BUTTON_PRIMARY) {
        item.activate(0, 0);
        return;
      }
      menu?.popup_at_widget(self, Gdk.Gravity.SOUTH, Gdk.Gravity.NORTH, null);
    }}
  >
    <icon gicon={bind(item, "gicon")} />
  </button>;
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

