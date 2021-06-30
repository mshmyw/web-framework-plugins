import { union } from "lodash";

import {
  RuntimeData,
  StoryboardConfig,
  StoryboardComponentConfig,
} from "./interfaces";
import { loadComponentPlugins } from "./plugin";

export class Kernel {
  private runtimeData: RuntimeData = {
    meta: {
      componentMountPoint: "component-mount-point",
      scriptMountPoint: "script-mount-point",
    },
    componentPlugins: {},
    components: {},
    routes: {},
  };

  public registerComponentPlugin(
    name: string,
    uri: string,
    components: string[]
  ) {
    if (this.runtimeData.componentPlugins[name]) {
      throw new Error(`The component plugin "${name}" has existed!`);
    }

    this.runtimeData.componentPlugins[name] = {
      name,
      uri,
      isLoaded: false,
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

  public renderComponents = (
    componentMountPoint: string,
    components: StoryboardComponentConfig[]
  ): void => {
    const componentMountPointElement =
      document.getElementById(componentMountPoint);
    if (!componentMountPointElement) {
      throw new Error(
        `The component mount point "${componentMountPoint}" does not exist!`
      );
    }

    componentMountPointElement.innerHTML = "";

    components.forEach((component) => {
      const componentElement = document.createElement(component.name);
      componentMountPointElement.appendChild(componentElement);
      if (component.properties) {
        for (const [propertyName, propertyValue] of Object.entries(
          component.properties
        )) {
          componentElement[propertyName] = propertyValue;
        }
      }
    });
  };

  public renderRoute(uri: string) {
    const route = this.runtimeData.routes[uri];
    if (!route) {
      throw new Error(`The URI "${uri}" does not exist!`);
    }

    if (route.components) {
      const componentNames = union(
        route.components.map((component) => component.name)
      );
      const componentPluginNames = union(
        componentNames
          .filter((componentName) => this.runtimeData.components[componentName])
          .map(
            (componentName) =>
              this.runtimeData.components[componentName].pluginName
          )
      );

      loadComponentPlugins(this.runtimeData, componentPluginNames, () => {
        this.renderComponents(
          this.runtimeData.meta.componentMountPoint,
          route.components
        );
      });
    }
  }
}

export const kernel: Kernel = new Kernel();
