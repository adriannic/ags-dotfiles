import { Astal, Gdk, Gtk } from "astal/gtk3"
import Notifd from "gi://AstalNotifd"
import NotificationWidget from "./Notification"
import { Variable, bind } from "astal"
import GObject, { register, property, signal } from "astal/gobject"

export enum NotificationState {
  INVISIBLE,
  VISIBLE,
  FROZEN
}

export const visible: Map<number, Variable<NotificationState>> = new Map()

@register()
class NotificationMap extends GObject.Object {
  #map: Map<number, Notifd.Notification> = new Map()
  #subs = new Set<(v: Array<Notifd.Notification>) => void>

  #delete(key: number) {
    const v = this.#map.get(key)
    this.#map.delete(key)
  }

  constructor() {
    super()
    const notifd = Notifd.get_default()

    // Clean up all old notifications
    notifd.notifications.forEach((notification) => notification.dismiss())

    notifd.connect("notified", (_, id) => {
      if (!visible.has(id)) {
        visible.set(id, Variable(NotificationState.VISIBLE))
      }
      visible.get(id)?.set(NotificationState.VISIBLE)
      this.add(id, notifd.get_notification(id))
    })

    notifd.connect("resolved", (_, id) => {
      this.delete(id)
    })
  }

  add(key: number, value: Notifd.Notification) {
    this.delete(key)
    this.#map.set(key, value)
    this.added(value)
  }

  delete(key: number) {
    const value = this.#map.get(key)
    this.#delete(key)
    if (value instanceof Notifd.Notification) {
      this.removed(value)
    }
  }

  @signal(Notifd.Notification)
  declare added: (notif: Notifd.Notification) => void
  @signal(Notifd.Notification)
  declare removed: (notif: Notifd.Notification) => void
}

const notifications = new NotificationMap()

export default function NotificationPopups(gdkmonitor: Gdk.Monitor) {
  const { TOP, RIGHT } = Astal.WindowAnchor
  const widget_map: Map<number, Gtk.Widget> = new Map()

  return <window
    className="NotificationPopups"
    gdkmonitor={gdkmonitor}
    exclusivity={Astal.Exclusivity.EXCLUSIVE}
    margin={4}
    layer={Astal.Layer.TOP}
    anchor={TOP | RIGHT}>
    <box vertical
      setup={(self: any) => {
        const updateBoxChildren = () => {
          const children = Array.from(widget_map.values()).reverse()
          self.set_children(children)
        }

        self.hook(notifications, "added", (_: any, notif: Notifd.Notification) => {
          if (!widget_map.has(notif.get_id())) {
            const widget = NotificationWidget(notif)
            widget_map.set(notif.get_id(), widget)
            updateBoxChildren()
          }
        })

        self.hook(notifications, "removed", (_: any, notif: Notifd.Notification) => {
          if (widget_map.has(notif.get_id())) {
            widget_map.delete(notif.get_id())
            updateBoxChildren()
          }
        })
      }}
    />
  </window>
}
