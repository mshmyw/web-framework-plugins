import { StoryboardRouteConfig } from "./storyboard";

export interface RuntimeMetaData {
  componentMountPoint: string;
  scriptMountPoint: string;
}

export interface RuntimeComponentPluginData {
  name: string;
  uri: string;
  isLoaded: boolean;
}

export interface RuntimeComponentData {
  pluginName: string;
}

export type RuntimeRouteData = StoryboardRouteConfig;

export interface RuntimeData {
  meta: RuntimeMetaData;
  componentPlugins: { [name: string]: RuntimeComponentPluginData };
  components: { [name: string]: RuntimeComponentData };
  routes: { [uri: string]: RuntimeRouteData };
}
