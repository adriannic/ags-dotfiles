import Battery from "gi://AstalBattery";
import { bind } from "astal";
import { Icon } from "astal/gtk3/widget";

export function BatteryWidget() {
    const battery = Battery.get_default();

    const to_breeze_dark = (icon: string) => `/usr/share/icons/breeze-dark/status/16/${icon}.svg`;

    const update_icon = (self: Icon) => {
        // If there's no battery return
        if (battery.device_type !== Battery.Type.BATTERY || battery.power_supply !== true)
            return;

        const charging = battery.charging;
        const percent = String(Math.round(battery.percentage * 10)).padStart(2, '0');
        self.icon = to_breeze_dark(`battery-${percent}0${charging ? "-charging" : ""}`);
    };

    return <icon
        className="batteryIcon"
        visible={battery.device_type === Battery.Type.BATTERY && battery.power_supply === true}
        icon={to_breeze_dark("battery-missing")}
        tooltipText={bind(battery, "percentage").as((percent) => `${Math.round(percent * 100)}%`)}
        setup={self => {
            update_icon(self);
            self.hook(bind(battery, "percentage"), update_icon);
            self.hook(bind(battery, "charging"), update_icon);
        }} />;
}

