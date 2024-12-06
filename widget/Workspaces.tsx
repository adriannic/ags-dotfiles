import Gtk from "gi://Gtk?version=3.0";
import Hyprland from "gi://AstalHyprland";
import { Box } from "astal/gtk3/widget";
import Settings from "./Settings";

const hypr = Hyprland.get_default();

function IndicatorWidget({ monitor }: { monitor: string; }) {
  const updateWorkspace: (self: Box, event: string) => void = (self, event) => {
    if (event !== "workspacev2")
      return;

    const monitors = hypr.get_monitors();
    const selectedWorkspace = monitors[parseInt(monitor)].activeWorkspace.id;
    self.visible = selectedWorkspace < 10;

    const marginLeft = (selectedWorkspace - 1) * 30 + 4;
    const marginRight = (Settings.workspaceList.length - selectedWorkspace) * 30 + 4;
    self.css = `
                        margin-left: ${marginLeft}px;
                        margin-right: ${marginRight}px;
                        transition: margin ${Settings.ANIMATION_SPEED_IN_MILLIS}ms ease-in-out;`;
  };

  return <box>
    <box
      hexpand
      vexpand
      className="selectedWorkspace"
      setup={self => {
        updateWorkspace(self, "workspacev2");
        self.hook(hypr, "event", updateWorkspace);
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
