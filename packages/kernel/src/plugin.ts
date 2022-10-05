import { RuntimeData, RuntimeComponentPluginData } from "./interfaces";

export enum PluginLoadStatus {
  Loading,
  Success,
}

export function loadPlugins(
  scriptMountPoint: string,
  pluginURIs: string[],
  callback: (pluginLoadStatuses: {
    [pluginURI: string]: PluginLoadStatus;
  }) => void
) {
  const pluginLoadStatuses:any = {};
  pluginURIs.forEach(
    (pluginURI) => (pluginLoadStatuses[pluginURI] = PluginLoadStatus.Loading)
  );

  const scriptMountPointElement = document.getElementById(scriptMountPoint);
  if (!scriptMountPointElement) {
    throw new Error(
      `The script mount point "${scriptMountPoint}" does not exist!`
    );
  }
  pluginURIs.forEach((pluginURI) => {
    const scriptElement = document.createElement("script");
    scriptElement.setAttribute("src", pluginURI);
    scriptMountPointElement.appendChild(scriptElement);
    scriptElement.onload = () => {
      pluginLoadStatuses[pluginURI] = PluginLoadStatus.Success;
      if (
        Object.values(pluginLoadStatuses).every(
          (pluginLoadedStatus) =>
            pluginLoadedStatus !== PluginLoadStatus.Loading
        )
      ) {
        callback(pluginLoadStatuses);
      }
    };
  });
}

export function loadLibraryPlugins(
  runtimeData: RuntimeData,
  pluginNames: string[],
  callback: () => void
): void {
  const notLoadedPlugins = pluginNames
    .map((pluginName) => {
      const plugin = runtimeData.libraryPlugins[pluginName];
      if (!plugin) {
        throw new Error(`The library plugin "${pluginName}" does not exist!`);
      }

      return plugin;
    })
    .filter((plugin) => !plugin.isLoaded);

  if (notLoadedPlugins.length !== 0) {
    loadPlugins(
      runtimeData.meta.scriptMountPoint,
      notLoadedPlugins.map((plugin) => plugin.uri),
      (pluginLoadStatuses: { [pluginURI: string]: PluginLoadStatus }): void => {
        notLoadedPlugins.forEach((notLoadedPlugin) => {
          if (
            pluginLoadStatuses[notLoadedPlugin.uri] === PluginLoadStatus.Success
          ) {
            notLoadedPlugin.isLoaded = true;
          }
        });
        callback();
      }
    );
  }
}

export function loadComponentPlugins(
  runtimeData: RuntimeData,
  pluginNames: string[],
  callback: () => void
): void {
  const notLoadedPlugins = pluginNames
    .map((pluginName) => {
      const plugin = runtimeData.componentPlugins[pluginName];
      if (!plugin) {
        throw new Error(`The component plugin "${pluginName}" does not exist!`);
      }

      return plugin;
    })
    .filter((plugin) => !plugin.isLoaded);

  if (notLoadedPlugins.length !== 0) {
    loadPlugins(
      runtimeData.meta.scriptMountPoint,
      notLoadedPlugins.map((plugin) => plugin.uri),
      (pluginLoadStatuses: { [pluginURI: string]: PluginLoadStatus }): void => {
        notLoadedPlugins.forEach((notLoadedPlugin) => {
          if (
            pluginLoadStatuses[notLoadedPlugin.uri] === PluginLoadStatus.Success
          ) {
            notLoadedPlugin.isLoaded = true;
          }
        });
        callback();
      }
    );
  }
}
