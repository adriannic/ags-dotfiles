#!/usr/bin/ags run

import { App, Gdk, Gtk } from "astal/gtk3"
import { exec } from "astal/process"
import Bar from "./widget/Bar"
import Spacer from "./widget/Spacer"
import Background from "./widget/Background"
import Notifications from "./widget/Notifications"

exec("sass ./style.scss /tmp/style.css");

App.start({
    css: "/tmp/style.css",
    main() {
        const spacers = new Map<Gdk.Monitor, Gtk.Widget>();
        const bars = new Map<Gdk.Monitor, Gtk.Widget>();
        const bgs = new Map<Gdk.Monitor, Gtk.Widget>();
        const notifications = new Map<Gdk.Monitor, Gtk.Widget>();

        App.get_monitors().forEach((gdkmonitor, id) => {
            spacers.set(gdkmonitor, Spacer(gdkmonitor, id));
            bars.set(gdkmonitor, Bar(gdkmonitor, id));
            bgs.set(gdkmonitor, Background(gdkmonitor, id));
            notifications.set(gdkmonitor, Notifications(gdkmonitor));
        });

        App.connect("monitor-added", (_, gdkmonitor) => {
            const id = App.get_monitors().indexOf(gdkmonitor);

            spacers.set(gdkmonitor, Spacer(gdkmonitor, id));
            bars.set(gdkmonitor, Bar(gdkmonitor, id));
            bgs.set(gdkmonitor, Background(gdkmonitor, id));
            notifications.set(gdkmonitor, Notifications(gdkmonitor));
        })

        App.connect("monitor-removed", (_, gdkmonitor) => {
            spacers.get(gdkmonitor)?.destroy();
            bars.get(gdkmonitor)?.destroy();
            bgs.get(gdkmonitor)?.destroy();
            notifications.get(gdkmonitor)?.destroy();

            spacers.delete(gdkmonitor);
            bars.delete(gdkmonitor);
            bgs.delete(gdkmonitor);
            notifications.delete(gdkmonitor);
        });
    },
})
