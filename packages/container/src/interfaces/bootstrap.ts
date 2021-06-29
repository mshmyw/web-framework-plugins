import { StoryboardConfig } from "@chenshaorui/web-framework-kernel";

export interface BootstrapComponentPluginInfo {
  name: string;
  uri: string;
  components: string[];
}

export interface BootstrapPluginsInfo {
  component: BootstrapComponentPluginInfo[];
}

export interface BootstrapInfo {
  plugins: BootstrapPluginsInfo;
  storyboards: StoryboardConfig[];
}
