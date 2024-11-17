import Astal from "gi://Astal?version=3.0";
import { Gtk } from "astal/gtk3"
import { Variable, exec } from "astal";
import Settings from "./Settings";


export const SelectedMenu = Variable("");
export const SelectedOption = Variable("");
const os: string = exec(
  "bash -c 'grep -e ^ID /etc/os-release | cut -c 4-'"
);
const osLogos = {
  arch: "",
  nixos: "",
};
function OptionButton({ label, padding, command, monitor }: { label: string; padding: number; command: string; monitor: string; }) {
  return <stack
    transitionType={Gtk.StackTransitionType.OVER_RIGHT_LEFT}
    transitionDuration={Settings.ANIMATION_SPEED_IN_MILLIS}
    shown={SelectedOption((value) => value === `${label}-${monitor}` ? value : "")}
  >
    <button
      name=""
      onClick={() => SelectedOption.set(`${label}-${monitor}`)}>
      <label label={label} css={`padding-right: ${padding}px;`} />
    </button>
    <button
      name={`${label}-${monitor}`}
      onClick={(_, event) => {
        if (event.button === Astal.MouseButton.PRIMARY) {
          exec(command);
        } else if (event.button === Astal.MouseButton.SECONDARY) {
          SelectedOption.set("");
        }
      }}
    >
      <label label="" css="padding-right: 4px;" />
    </button>
  </stack>;
}
function OptionsMenu({ monitor }: { monitor: string; }) {
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
  </box>;
}
export function LogoButton({ monitor }: { monitor: string; }) {
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
          : `powermenu-${monitor}`);
      }}>

      <label label={osLogos[os as keyof typeof osLogos]} css="padding-right: 6px;"></label>
    </button>
  </box>;
}

