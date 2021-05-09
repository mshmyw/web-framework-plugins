const fs = require("fs");
const lodash = require("lodash");
const path = require("path");

const readConfigurations = (configurationFilePath) => {
  const configurationFileContent = fs
    .readFileSync(configurationFilePath)
    .toString();

  try {
    return JSON.parse(configurationFileContent);
  } catch {
    throw new Error(
      `The content of configuration file "${configurationFilePath}" is not JSON serializable!`
    );
  }
};

const loadDefaultConfigurations = (packageDirectory) => {
  const defaultConfigurationFilePath = path.join(
    packageDirectory,
    "config",
    "config.default.json"
  );

  if (!fs.existsSync(defaultConfigurationFilePath)) {
    throw new Error(
      `The default configuration file "${defaultConfigurationFilePath}" doesn't exist!`
    );
  }
  if (!fs.lstatSync(defaultConfigurationFilePath).isFile()) {
    throw new Error(
      `The default configuration file "${defaultConfigurationFilePath}" is not a file!`
    );
  }

  return readConfigurations(defaultConfigurationFilePath);
};

const loadCustomConfigurations = (packageDirectory) => {
  let customConfigurations = {};

  const customConfigurationFilePath = path.join(
    packageDirectory,
    "config",
    "config.json"
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

const loadConfigurations = (packageDirectory) => {
  const defaultConfigurations = loadDefaultConfigurations(packageDirectory);
  const customConfigurations = loadCustomConfigurations(packageDirectory);
  return lodash.merge(defaultConfigurations, customConfigurations);
};

module.exports = {
  loadConfigurations,
};
