const fs = require("fs");
const glob = require("glob");
const path = require("path");

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

const loadComponentPlugin = (componentPluginDirectory) => {
  const componentPluginDefinitionFilePath = path.join(
    componentPluginDirectory,
    PLUGIN.OUTPUT_DEFINITION_FILE_NAME
  );
  if (
    !fs.existsSync(componentPluginDefinitionFilePath) ||
    !fs.lstatSync(componentPluginDefinitionFilePath).isFile()
  ) {
    console.warn(
      `There is no "${PLUGIN.OUTPUT_DEFINITION_FILE_NAME}" in component plugin "${componentPluginDirectory}"!`
    );
    return null;
  }

  let componentPluginDefinition = {};
  try {
    componentPluginDefinition = JSON.parse(
      fs.readFileSync(componentPluginDefinitionFilePath).toString()
    );
  } catch {
    console.warn(
      `The content of "${componentPluginDefinitionFilePath}" is not JSON serializable!`
    );
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
      .forEach((componentPluginDirectory) => {
        const componentPlugin = loadComponentPlugin(componentPluginDirectory);
        if (componentPlugin) {
          componentPlugins.push(componentPlugin);
        }
      });
  });

  return componentPlugins;
};

module.exports = {
  loadComponentPlugins,
};
