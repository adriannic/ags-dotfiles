import { App, Astal, Gtk, Gdk } from "astal/gtk3"
import { bind, exec } from "astal"
import Battery from "gi://AstalBattery?version=0.1";
import Settings from "./Settings";
import SystemTray from "gi://AstalTray";
import Variable from "astal/variable";

export const SelectedMenu = Variable("");
export const SelectedOption = Variable("");

const os: string = exec(
    "bash -c 'grep -e ^ID /etc/os-release | cut -c 4-'",
);

const osLogos = {
    arch: "",
    nixos: "",
};

function OptionButton({ label, padding, command, monitor }: { label: string, padding: number, command: string, monitor: string }) {
    return <stack
        transitionType={Gtk.StackTransitionType.OVER_RIGHT_LEFT}
        transitionDuration={Settings.ANIMATION_SPEED_IN_MILLIS}
        shown={SelectedOption((value) => value === `${label}-${monitor}` ? value : "")}
    >
        <button
            name=""
            onClick={() => SelectedOption.set(`${label}-${monitor}`)} >
            <label label={label} css={`padding-right: ${padding}px;`} />
        </button>
        <button
            name={`${label}-${monitor}`}
            onClick={(_, event) => {
                if (event.button === Astal.MouseButton.PRIMARY) {
                    exec(command)
                } else if (event.button === Astal.MouseButton.SECONDARY) {
                    SelectedOption.set("")
                }
            }}
        >
            <label label="" css="padding-right: 4px;" />
        </button>
    </stack>
}

function OptionsMenu({ monitor }: { monitor: string }) {
    return <box
        className="container"
        css="min-height: 100px;"
        vertical
        valign={Gtk.Align.END}
    >
        <OptionButton label="" padding={2} command="systemctl reboot --boot-loader-entry=auto-windows" monitor={monitor} />
        <OptionButton label="󰍃" padding={0} command="hyprctl dispatch exit" monitor={monitor} />
        <OptionButton label="󰜉" padding={1} command="reboot" monitor={monitor} />
        <OptionButton label="" padding={4} command="shutdown now" monitor={monitor} />
    </box>
}

function LogoButton({ monitor }: { monitor: string }) {
    return <box vertical valign={Gtk.Align.END} spacing={4}>
        <revealer
            css="min-height: 50px;"
            revealChild={SelectedMenu().as((selected: string) => selected === `powermenu-${monitor}`)}
            transitionDuration={Settings.ANIMATION_SPEED_IN_MILLIS}
            transitionType={Gtk.RevealerTransitionType.SLIDE_UP}>
            <OptionsMenu monitor={monitor} />
        </revealer>
        <button
            className="container"
            onClick={() => {
                SelectedOption.set("");
                SelectedMenu.set(SelectedMenu.get() === `powermenu-${monitor}`
                    ? ""
                    : `powermenu-${monitor}`)
            }}>

            <label label={osLogos[os as keyof typeof osLogos]} css="padding-right: 6px;"></label>
        </button>
    </box >
}

const focusedWorkspace = Variable("{}").poll(150, "hyprctl monitors -j")

function IndicatorWidget({ monitor }: { monitor: string }) {
    return <box>
        <box
            hexpand
            vexpand
            className="selectedWorkspace"
            setup={self => {
                self.hook(focusedWorkspace, (self) => {
                    const monitors = JSON.parse(focusedWorkspace.get());
                    const selectedWorkspace = monitors[parseInt(monitor)].activeWorkspace.id;
                    self.visible = selectedWorkspace < 10;

                    const marginLeft = (selectedWorkspace - 1) * 30 + 4;
                    const marginRight = (Settings.workspaceList.length - selectedWorkspace) * 30 + 4;
                    self.css = `
                        margin-left: ${marginLeft}px;
                        margin-right: ${marginRight}px;
                        transition: margin ${Settings.ANIMATION_SPEED_IN_MILLIS}ms ease-in-out;`
                })
            }}
        />
    </box>
}

function WorkspaceButton({ entry }: { entry: { name: string, index: number } }) {
    return <button
        onClick={`hypr-workspaces ${entry.index}`}
        tooltipText={entry.name}
    >
        <label label={`${entry.index}`} />
    </button>
}

function Workspaces({ monitor }: { monitor: string }) {
    return <box
        vertical
        valign={Gtk.Align.END}
    >
        <overlay
            passThrough
            overlays={[<IndicatorWidget monitor={monitor} />]}
        >
            <box className="container">
                {Settings.workspaceList.map((entry: { name: string, index: number }) =>
                    (<WorkspaceButton entry={entry} />))}
            </box>
        </overlay>
    </box>
}

function StartWidgets({ monitor }: { monitor: string }) {
    return <box spacing={4} halign={Gtk.Align.START} valign={Gtk.Align.END}>
        <LogoButton monitor={monitor} />
        <Workspaces monitor={monitor} />
    </box>
}

function CenterWidgets() {
    return <box />
}

function SysTrayItem(item: SystemTray.TrayItem) {
    if (item.iconThemePath) {
        App.add_icons(item.iconThemePath);
    }

    const menu = item.create_menu();

    return <button
        tooltipMarkup={bind(item, "tooltipMarkup")}
        onDestroy={() => menu?.destroy()}
        onClickRelease={self =>
            menu?.popup_at_widget(self, Gdk.Gravity.SOUTH, Gdk.Gravity.NORTH, null)
        }
    >
        <icon gIcon={bind(item, "gicon")} />
    </button>
}

function BatteryWidget() {
    const battery = Battery.get_default();

    return <icon
        className="batteryIcon"
        visible={bind(battery, "online")}
        icon={bind(battery, "iconName")}
        tooltipText={bind(battery, "percentage").as((percent) => `${percent}%`)}
    />
}

function Systray() {
    const tray = SystemTray.get_default();
    return <box className="container">
        {bind(tray, "items").as((items) => {
            const trayItems = items.map((item) => SysTrayItem(item));
            const trayWidgets = [BatteryWidget()];
            return [...trayItems, ...trayWidgets];
        })}
    </box>
}

const Time = Variable("00:00:00").poll(1000, "date +%T");

const Date = Variable("01/01/70").poll(1000, "date +%d/%m/%g");

function Clock() {
    const Shown = Variable("time");

    return <button
        className="container"
        onClick={() => Shown.set(Shown.get() === "time" ? "date" : "time")}
        css="padding: 0px 4px;"
    >
        <stack
            transitionType={Gtk.StackTransitionType.SLIDE_UP_DOWN}
            transitionDuration={Settings.ANIMATION_SPEED_IN_MILLIS}
            shown={Shown()}
        >
            <label name="time" label={Time()}></label>
            <label name="date" label={Date()}></label>
        </stack>
    </button>
}

function EndWidgets() {
    return <box
        spacing={4}
        halign={Gtk.Align.END}
        valign={Gtk.Align.END}>
        <Systray />
        <Clock />
    </box>
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
