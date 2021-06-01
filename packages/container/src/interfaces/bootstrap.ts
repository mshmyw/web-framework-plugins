export interface BootstrapComponentPluginInfo {
  name: string;
  components: string[];
}

export interface BootstrapInfo {
  components: BootstrapComponentPluginInfo[];
}
