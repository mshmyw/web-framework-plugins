import { StoryboardConfig } from "@chenshaorui/web-framework-kernel";

export interface BootstrapLibraryPluginInfo {
  name: string;
  uri: string;
}

export interface BootstrapComponentPluginInfo {
  name: string;
  uri: string;
  components: string[];
}

export interface BootstrapPluginsInfo {
  library: BootstrapLibraryPluginInfo[];
  component: BootstrapComponentPluginInfo[];
}

export interface BootstrapInfo {
  plugins: BootstrapPluginsInfo;
  storyboards: StoryboardConfig[];
}
