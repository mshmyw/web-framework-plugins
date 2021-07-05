const fs = require("fs");
const path = require("path");

const glob = require("glob");

const { PLUGIN } = require("@chenshaorui/web-framework-tool-build-metadata");

const convertComponentPluginDefinition = (
  componentPluginDefinition,
  componentPluginDefinitionFilePath
) => {
  // TODO(chenshaorui): Use a JSON schema validation library to validate the schema of component plugin definition file.
  const requiredFields = ["name", "components"];
  for (const requiredField of requiredFields) {
    if (!componentPluginDefinition[requiredField]) {
      console.warn(
        `There is no "${requiredField}" field in "${componentPluginDefinitionFilePath}"!`
      );
      return null;
    }
  }

  return {
    name: componentPluginDefinition.name,
    components: componentPluginDefinition.components,
  };
};

const loadComponentPlugin = (componentPluginDirectoryPath) => {
  const componentPluginDefinitionFilePath = path.join(
    componentPluginDirectoryPath,
    PLUGIN.OUTPUT_DEFINITION_FILE_NAME
  );

  if (!fs.existsSync(componentPluginDefinitionFilePath)) {
    console.warn(
      `There is no "${PLUGIN.OUTPUT_DEFINITION_FILE_NAME}" in component plugin "${componentPluginDirectoryPath}"!`
    );
    return null;
  }
  if (!fs.lstatSync(componentPluginDefinitionFilePath).isFile()) {
    console.warn(
      `The component plugin definition file "${componentPluginDefinitionFilePath}" is not a file!`
    );
    return null;
  }

  let componentPluginDefinition = null;

  const componentPluginDefinitionFileContent = fs
    .readFileSync(componentPluginDefinitionFilePath)
    .toString();
  try {
    componentPluginDefinition = JSON.parse(
      componentPluginDefinitionFileContent
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.warn(
        `The content of "${componentPluginDefinitionFilePath}" is not JSON serializable!`
      );
    } else {
      console.warn(
        `Parse component plugin definition failed: ${error.message}`
      );
    }
    return null;
  }

  return convertComponentPluginDefinition(
    componentPluginDefinition,
    componentPluginDefinitionFilePath
  );
};

const loadComponentPlugins = (componentPluginPathPatterns) => {
  const componentPlugins = [];

  componentPluginPathPatterns.forEach((componentPluginPathPattern) => {
    const componentPluginPaths = glob.sync(componentPluginPathPattern);
    componentPluginPaths
      .filter((componentPluginPath) =>
        fs.lstatSync(componentPluginPath).isDirectory()
      )
      .forEach((componentPluginDirectoryPath) => {
        const componentPlugin = loadComponentPlugin(
          componentPluginDirectoryPath
        );
        if (componentPlugin) {
          componentPlugins.push(componentPlugin);
        }
      });
  });

  return componentPlugins;
};

const getComponentPluginBundleFilePathByName = (
  componentPluginPathPatterns,
  componentPluginName
) => {
  for (const componentPluginPathPattern of componentPluginPathPatterns) {
    const componentPluginPaths = glob.sync(componentPluginPathPattern);
    const componentPluginDirectoryPaths = componentPluginPaths.filter(
      (componentPluginPath) => fs.lstatSync(componentPluginPath).isDirectory()
    );
    for (const componentPluginDirectoryPath of componentPluginDirectoryPaths) {
      const componentPlugin = loadComponentPlugin(componentPluginDirectoryPath);
      if (componentPlugin && componentPlugin.name === componentPluginName) {
        return path.join(
          componentPluginDirectoryPath,
          PLUGIN.OUTPUT_BUNDLE_FILE_NAME
        );
      }
    }
  }

  return null;
};

module.exports = {
  loadComponentPlugins,
  getComponentPluginBundleFilePathByName,
};
