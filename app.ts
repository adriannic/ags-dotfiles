#!/usr/bin/ags run

import { App } from "astal/gtk3"
import { exec } from "astal/process"
import Bar from "./widget/Bar"
import Spacer from "./widget/Spacer"
import Background from "./widget/Background"

exec("sass ./style.scss /tmp/style.css");

App.start({
    css: "/tmp/style.css",
    main() {
        App.get_monitors().map(Spacer);
        App.get_monitors().map(Bar);
        App.get_monitors().map(Background);
    },
})
