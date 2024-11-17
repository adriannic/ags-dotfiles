import { App, Astal, Gdk, Gtk } from "astal/gtk3"
import { Clock } from "./Clock";
import { Systray } from "./Systray";
import { LogoButton } from "./LogoButton";
import { Workspaces } from "./Workspaces";

function StartWidgets({ monitor }: { monitor: string; }) {
    return <box spacing={4} halign={Gtk.Align.START} valign={Gtk.Align.END}>
        <LogoButton monitor={monitor} />
        <Workspaces monitor={monitor} />
    </box>;
}

function CenterWidgets() {
    return <box />;
}

function EndWidgets() {
    return <box
        spacing={4}
        halign={Gtk.Align.END}
        valign={Gtk.Align.END}>
        <Systray />
        <Clock />
    </box>;
}

export default function Bar(monitor: Gdk.Monitor, id: number) {
    return <window
        className="barWindow"
        name={`bar-${id}`}
        gdkmonitor={monitor}
        anchor={Astal.WindowAnchor.BOTTOM
            | Astal.WindowAnchor.LEFT
            | Astal.WindowAnchor.RIGHT}
        application={App} marginBottom={-36} marginTop={-36}>
        <centerbox className="bar">
            <StartWidgets monitor={`${id}`} />
            <CenterWidgets />
            <EndWidgets />
        </centerbox>
    </window >
}
