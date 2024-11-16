import { App, Astal, Gdk } from "astal/gtk3"


export default function Spacer(gdkmonitor: Gdk.Monitor, id: number) {
  return <window
    name={`spacer-${id}`}
    gdkmonitor={gdkmonitor}
    exclusivity={Astal.Exclusivity.EXCLUSIVE}
    anchor={Astal.WindowAnchor.BOTTOM
      | Astal.WindowAnchor.LEFT
      | Astal.WindowAnchor.RIGHT}
    application={App}>
    <label label="" css="min-height: 36px;" />
  </window>
}
