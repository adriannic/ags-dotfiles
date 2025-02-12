import { bind, GLib, timeout, Variable } from "astal"
import { Gtk, Astal } from "astal/gtk3"
import Notifd from "gi://AstalNotifd"
import Settings from "./Settings"

const isIcon = (icon: string) =>
  !!Astal.Icon.lookup_icon(icon)

const fileExists = (path: string) =>
  GLib.file_test(path, GLib.FileTest.EXISTS)

const time = (time: number, format = "%H:%M:%S") => GLib.DateTime
  .new_from_unix_local(time)
  .format(format)!

const urgency = (n: Notifd.Notification) => {
  const { LOW, NORMAL, CRITICAL } = Notifd.Urgency
  switch (n.urgency) {
    case LOW: return "low"
    case CRITICAL: return "critical"
    case NORMAL:
    default: return "normal"
  }
}

export default function Notification(notification: Notifd.Notification) {
  const revealer_outer = Variable(false);
  const revealer_inner = Variable(false);

  const open = () => {
    revealer_outer.set(true);
    timeout(Settings.ANIMATION_SPEED_IN_MILLIS, () => revealer_inner.set(true));
  };

  const close = () => {
    revealer_inner.set(false);
    timeout(Settings.ANIMATION_SPEED_IN_MILLIS, () => revealer_outer.set(false));
    timeout(Settings.ANIMATION_SPEED_IN_MILLIS * 2, () => notification.dismiss());
  };

  return <box>
    <box hexpand />
    <revealer
      transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
      transitionDuration={Settings.ANIMATION_SPEED_IN_MILLIS}
      revealChild={bind(revealer_outer)}>
      <eventbox
        className={`Notification ${urgency(notification)}`}
        setup={() => {
          timeout(0, open);
          if (notification.urgency !== Notifd.Urgency.CRITICAL) {
            timeout(Settings.TIMEOUT, close)
          }
        }}
        onHoverLost={close}
        onClick={close}>
        <box vertical className="container">
          <box className="header">
            <label
              className="app-name"
              halign={Gtk.Align.START}
              truncate
              label={notification.appName || "Unknown"}
            />
            <label
              className="time"
              hexpand
              halign={Gtk.Align.END}
              label={time(notification.time)}
            />
          </box>
          <revealer
            transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
            transitionDuration={Settings.ANIMATION_SPEED_IN_MILLIS}
            revealChild={bind(revealer_inner)}>
            <box className="content">
              {notification.image && fileExists(notification.image) && <box
                valign={Gtk.Align.START}
                className="image"
                css={`background-image: url('${notification.image}')`}
              />}
              {notification.image && isIcon(notification.image) && <box
                expand={false}
                valign={Gtk.Align.START}
                className="icon-image">
                <icon icon={notification.image} expand halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER} />
              </box>}
              {!notification.image && (notification.appIcon || notification.desktopEntry) && <box
                valign={Gtk.Align.START}
                className="image"
                css={`background-image: url('${notification.appIcon}')`}
              />}
              <box vertical>
                <label
                  className="summary"
                  halign={Gtk.Align.START}
                  xalign={0}
                  label={notification.summary}
                  truncate
                />
                {notification.body && <label
                  className="body"
                  wrap
                  maxWidthChars={44}
                  useMarkup
                  halign={Gtk.Align.START}
                  xalign={0}
                  label={notification.body}
                  hexpand
                />}
              </box>
            </box>
          </revealer>
          {notification.get_actions().length > 0 && <box>
            {notification.get_actions().map(({ label, id }) => (
              <button
                className="actionButton"
                hexpand
                onClicked={() => notification.invoke(id)}>
                <label label={label} halign={Gtk.Align.CENTER} hexpand />
              </button>
            ))}
          </box>}
        </box>
      </eventbox>
    </revealer>
  </box>
}
