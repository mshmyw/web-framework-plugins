const fs = require("fs");
const path = require("path");

const lodash = require("lodash");

const CONFIGURATION_DIRECTORY_NAME = "config";
const DEFAULT_CONFIGURATION_FILE_NAME = "config.default.json";
const CUSTOM_CONFIGURATION_FILE_NAME = "config.json";

const readConfigurations = (configurationFilePath) => {
  const configurationFileContent = fs
    .readFileSync(configurationFilePath)
    .toString();

  try {
    // TODO(chenshaorui): Use a JSON schema validation library to validate the schema of configurations.
    return JSON.parse(configurationFileContent);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(
        `The content of configuration file "${configurationFilePath}" is not JSON serializable!`
      );
    }
    throw error;
  }
};

const loadDefaultConfigurations = (configurationDirectoryPath) => {
  const defaultConfigurationFilePath = path.join(
    configurationDirectoryPath,
    DEFAULT_CONFIGURATION_FILE_NAME
  );

  if (!fs.existsSync(defaultConfigurationFilePath)) {
    throw new Error(
      `The default configuration file "${defaultConfigurationFilePath}" does not exist!`
    );
  }
  if (!fs.lstatSync(defaultConfigurationFilePath).isFile()) {
    throw new Error(
      `The default configuration file "${defaultConfigurationFilePath}" is not a file!`
    );
  }

  return readConfigurations(defaultConfigurationFilePath);
};

const loadCustomConfigurations = (configurationDirectoryPath) => {
  let customConfigurations = {};

  const customConfigurationFilePath = path.join(
    configurationDirectoryPath,
    CUSTOM_CONFIGURATION_FILE_NAME
  );
  if (fs.existsSync(customConfigurationFilePath)) {
    if (!fs.lstatSync(customConfigurationFilePath).isFile()) {
      throw new Error(
        `The custom configuration file "${customConfigurationFilePath}" is not a file!`
      );
    }

    customConfigurations = readConfigurations(customConfigurationFilePath);
  }

  return customConfigurations;
};

const loadConfigurations = (packageDirectoryPath) => {
  const configurationDirectoryPath = path.join(
    packageDirectoryPath,
    CONFIGURATION_DIRECTORY_NAME
  );
  const defaultConfigurations = loadDefaultConfigurations(
    configurationDirectoryPath
  );
  const customConfigurations = loadCustomConfigurations(
    configurationDirectoryPath
  );
  return lodash.merge(defaultConfigurations, customConfigurations);
};

module.exports = {
  loadConfigurations,
};
