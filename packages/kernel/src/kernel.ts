import { RuntimeData } from "./interfaces";

export class Kernel {
  private runtimeData: RuntimeData = {
    componentPlugins: {},
    components: {},
  };

  public registerComponentPlugin(name: string, components: string[]) {
    this.runtimeData.componentPlugins[name] = {
      name,
    };

    components.forEach((component) => {
      this.runtimeData.components[component] = {
        pluginName: name,
      };
    });
  }
}

export const kernel: Kernel = new Kernel();
