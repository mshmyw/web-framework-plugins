import { StoryboardConfig } from "@chenshaorui/web-framework-kernel";

export interface BootstrapComponentPluginInfo {
  name: string;
  uri: string;
  components: string[];
}

export interface BootstrapInfo {
  components: BootstrapComponentPluginInfo[];
  storyboards: StoryboardConfig[];
}
