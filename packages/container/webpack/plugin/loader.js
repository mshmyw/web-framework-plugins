const fs = require("fs");
const path = require("path");

const glob = require("glob");

const { PLUGIN } = require("@krill/web-framework-tool-build-metadata");

const convertPluginDefinition = (
  pluginDefinition,
  pluginDefinitionFilePath
) => {
  // TODO(chenshaorui): Use a JSON schema validation library to validate the schema of component plugin definition file.
  const requiredFields = ["type", "name"];
  for (const requiredField of requiredFields) {
    if (!pluginDefinition[requiredField]) {
      console.warn(
        `There is no "${requiredField}" field in "${pluginDefinitionFilePath}"!`
      );
      return null;
    }
  }

  switch (pluginDefinition.type) {
    case "component":
      return {
        name: pluginDefinition.name,
        components: pluginDefinition.components,
      };
    case "library":
      return {
        name: pluginDefinition.name,
      };
  }
};

const loadPlugin = (pluginDirectoryPath) => {
  const pluginDefinitionFilePath = path.join(
    pluginDirectoryPath,
    PLUGIN.OUTPUT_DEFINITION_FILE_NAME
  );

  if (!fs.existsSync(pluginDefinitionFilePath)) {
    console.warn(
      `There is no "${PLUGIN.OUTPUT_DEFINITION_FILE_NAME}" in plugin "${pluginDirectoryPath}"!`
    );
    return null;
  }
  if (!fs.lstatSync(pluginDefinitionFilePath).isFile()) {
    console.warn(
      `The plugin definition file "${pluginDefinitionFilePath}" is not a file!`
    );
    return null;
  }

  let pluginDefinition = null;

  const pluginDefinitionFileContent = fs
    .readFileSync(pluginDefinitionFilePath)
    .toString();
  try {
    pluginDefinition = JSON.parse(pluginDefinitionFileContent);
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.warn(
        `The content of "${pluginDefinitionFilePath}" is not JSON serializable!`
      );
    } else {
      console.warn(`Parse plugin definition failed: ${error.message}`);
    }
    return null;
  }

  return convertPluginDefinition(pluginDefinition, pluginDefinitionFilePath);
};

const loadPlugins = (pluginPathPatterns) => {
  const plugins = [];

  pluginPathPatterns.forEach((pluginPathPattern) => {
    const pluginPaths = glob.sync(pluginPathPattern);
    pluginPaths
      .filter((pluginPath) => fs.lstatSync(pluginPath).isDirectory())
      .forEach((pluginDirectoryPath) => {
        const plugin = loadPlugin(pluginDirectoryPath);
        if (plugin) {
          plugins.push(plugin);
        }
      });
  });

  return plugins;
};

const getPluginBundleFilePathByName = (pluginPathPatterns, pluginName) => {
  for (const pluginPathPattern of pluginPathPatterns) {
    const pluginPaths = glob.sync(pluginPathPattern);
    const pluginDirectoryPaths = pluginPaths.filter((pluginPath) =>
      fs.lstatSync(pluginPath).isDirectory()
    );
    for (const pluginDirectoryPath of pluginDirectoryPaths) {
      const plugin = loadPlugin(pluginDirectoryPath);
      if (plugin && plugin.name === pluginName) {
        return path.join(pluginDirectoryPath, PLUGIN.OUTPUT_BUNDLE_FILE_NAME);
      }
    }
  }

  return null;
};

module.exports = {
  loadPlugins,
  getPluginBundleFilePathByName,
};
