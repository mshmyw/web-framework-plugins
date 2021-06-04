import { RuntimeData, StoryboardConfig } from "./interfaces";

export class Kernel {
  private runtimeData: RuntimeData = {
    componentPlugins: {},
    components: {},
    routes: {},
  };

  public registerComponentPlugin(
    name: string,
    uri: string,
    components: string[]
  ) {
    this.runtimeData.componentPlugins[name] = {
      name,
      uri,
    };

    components.forEach((component) => {
      this.runtimeData.components[component] = {
        pluginName: name,
      };
    });
  }

  public registerStoryboard(storyboardConfig: StoryboardConfig) {
    const storyboardRouteConfigs = storyboardConfig?.routes || [];

    storyboardRouteConfigs.forEach((storyboardRouteConfig) => {
      // TODO(chenshaorui): Use a JSON schema validation library to validate the schema of route storyboard configuration.
      if (storyboardRouteConfig?.uri) {
        this.runtimeData.routes[storyboardRouteConfig.uri] =
          storyboardRouteConfig;
      } else {
        console.error(
          'The field "uri" is missing in the route storyboard configuration!'
        );
      }
    });
  }
}

export const kernel: Kernel = new Kernel();
