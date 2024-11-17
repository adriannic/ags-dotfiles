import Gtk from "gi://Gtk?version=3.0";
import { Variable } from "../../../../../usr/share/astal/gjs";
import Settings from "./Settings";

const focusedWorkspace = Variable("{}").poll(150, "hyprctl monitors -j");
function IndicatorWidget({ monitor }: { monitor: string; }) {
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
                        transition: margin ${Settings.ANIMATION_SPEED_IN_MILLIS}ms ease-in-out;`;
        });
      }} />
  </box>;
}
function WorkspaceButton({ entry }: { entry: { name: string; index: number; }; }) {
  return <button
    onClick={`hypr-workspaces ${entry.index}`}
    tooltipText={entry.name}
  >
    <label label={`${entry.index}`} />
  </button>;
}
export function Workspaces({ monitor }: { monitor: string; }) {
  return <box
    vertical
    valign={Gtk.Align.END}
  >
    <overlay
      passThrough
      overlays={[<IndicatorWidget monitor={monitor} />]}
    >
      <box className="container">
        {Settings.workspaceList.map((entry: { name: string; index: number; }) => (<WorkspaceButton entry={entry} />))}
      </box>
    </overlay>
  </box>;
}
