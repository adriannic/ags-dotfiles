#!/usr/bin/ags run

import { App } from "astal/gtk3"
import style from "./style.css"
import Bar from "./widget/Bar"
import Spacer from "./widget/Spacer"

App.start({
    css: style,
    main() {
        App.get_monitors().map(Spacer);
        App.get_monitors().map(Bar);
    },
})
