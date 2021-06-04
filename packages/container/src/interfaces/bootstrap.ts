export interface BootstrapComponentPluginInfo {
  name: string;
  uri: string;
  components: string[];
}

export interface BootstrapInfo {
  components: BootstrapComponentPluginInfo[];
}
