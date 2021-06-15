import { RuntimeData } from "./interfaces";

export const loadComponentPlugins = (
  runtimeData: RuntimeData,
  pluginNames: string[],
  callback: () => void
): void => {
  const plugins = pluginNames.map((pluginName) => {
    const plugin = runtimeData.componentPlugins[pluginName];
    if (!plugin) {
      throw new Error(`The plugin "${pluginName}" does not exist!`);
    }

    return plugin;
  });

  const notLoadedPlugins = plugins.filter((plugin) => !plugin.isLoaded);
  if (notLoadedPlugins.length === 0) {
    callback();
  } else {
    notLoadedPlugins.forEach((plugin) => {
      const scriptMountPointElement = document.getElementById(
        runtimeData.meta.scriptMountPoint
      );
      if (!scriptMountPointElement) {
        throw new Error(
          `The script mount point "${runtimeData.meta.scriptMountPoint}" does not exist!`
        );
      }

      const scriptElement = document.createElement("script");
      scriptElement.setAttribute("src", plugin.uri);
      scriptMountPointElement.appendChild(scriptElement);
      scriptElement.onload = () => {
        plugin.isLoaded = true;
        if (notLoadedPlugins.every((plugin) => plugin.isLoaded)) {
          callback();
        }
      };
    });
  }
};
