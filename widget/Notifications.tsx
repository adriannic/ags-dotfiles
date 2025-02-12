import { Astal, Gtk, Gdk } from "astal/gtk3"
import Notifd from "gi://AstalNotifd"
import Notification from "./Notification"
import { type Subscribable } from "astal/binding"
import { Variable, bind } from "astal"

export enum NotificationState {
  INVISIBLE,
  VISIBLE,
  FROZEN
}

export const visible: Map<number, Variable<NotificationState>> = new Map();

class NotificationMap implements Subscribable {
  private map: Map<number, Gtk.Widget> = new Map()
  private var: Variable<Array<Gtk.Widget>> = Variable([])

  private notify() {
    this.var.set([...this.map.values()].reverse())
  }

  constructor() {
    const notifd = Notifd.get_default()

    // Clean up all old notifications
    notifd.notifications.forEach((notification) => notification.dismiss());

    notifd.connect("notified", (_, id) => {
      if (!visible.has(id)) {
        visible.set(id, Variable(NotificationState.VISIBLE))
      }
      visible.get(id)?.set(NotificationState.VISIBLE);
      this.set(id, Notification(notifd.get_notification(id)!))
    });

    notifd.connect("resolved", (_, id) => {
      this.delete(id)
    })
  }

  private set(key: number, value: Gtk.Widget) {
    this.map.get(key)?.destroy()
    this.map.set(key, value)
    this.notify()
  }

  private delete(key: number) {
    this.map.get(key)?.destroy()
    this.map.delete(key)
    this.notify()
  }

  get() {
    return this.var.get()
  }

  subscribe(callback: (list: Array<Gtk.Widget>) => void) {
    return this.var.subscribe(callback)
  }
}

export default function NotificationPopups(gdkmonitor: Gdk.Monitor) {
  const { TOP, RIGHT } = Astal.WindowAnchor
  const notifications = new NotificationMap()

  return <window
    className="NotificationPopups"
    gdkmonitor={gdkmonitor}
    exclusivity={Astal.Exclusivity.EXCLUSIVE}
    margin={4}
    layer={Astal.Layer.OVERLAY}
    anchor={TOP | RIGHT}>
    <box vertical>
      {bind(notifications)}
    </box>
  </window>
}
