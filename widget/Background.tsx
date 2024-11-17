import { App, Astal, Gdk } from "astal/gtk3"

export default function Background(gdkmonitor: Gdk.Monitor, id: number) {
  return <window
    name={`background-${id}`}
    gdkmonitor={gdkmonitor}
    anchor={Astal.WindowAnchor.BOTTOM
      | Astal.WindowAnchor.TOP
      | Astal.WindowAnchor.LEFT
      | Astal.WindowAnchor.RIGHT}
    application={App}
    layer={Astal.Layer.BACKGROUND}>
    <box></box>
  </window>
}
