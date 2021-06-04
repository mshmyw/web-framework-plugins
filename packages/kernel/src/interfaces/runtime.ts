import { StoryboardRouteConfig } from "./storyboard";

export interface RuntimeComponentPluginData {
  name: string;
  uri: string;
}

export interface RuntimeComponentData {
  pluginName: string;
}

export type RuntimeRouteData = StoryboardRouteConfig;

export interface RuntimeData {
  componentPlugins: { [name: string]: RuntimeComponentPluginData };
  components: { [name: string]: RuntimeComponentData };
  routes: { [uri: string]: RuntimeRouteData };
}
