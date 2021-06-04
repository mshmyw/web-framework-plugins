export interface RuntimeComponentPluginData {
  name: string;
  uri: string;
}

export interface RuntimeComponentData {
  pluginName: string;
}

export interface RuntimeData {
  componentPlugins: { [name: string]: RuntimeComponentPluginData };
  components: { [name: string]: RuntimeComponentData };
}
