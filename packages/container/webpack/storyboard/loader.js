const fs = require("fs");
const glob = require("glob");

const loadStoryboard = (storyboardFilePath) => {
  let storyboard = null;
  try {
    storyboard = JSON.parse(fs.readFileSync(storyboardFilePath).toString());
  } catch {
    console.warn(
      `The content of "${storyboardFilePath}" is not JSON serializable!`
    );
  }

  // TODO(chenshaorui): Use a JSON schema validation library to validate the schema of storyboard file.

  return storyboard;
};

const loadStoryboards = (storyboardPathPatterns) => {
  const storyboards = [];

  storyboardPathPatterns.forEach((storyboardPathPattern) => {
    const storyboardPaths = glob.sync(storyboardPathPattern);
    storyboardPaths
      .filter((storyboardPath) => fs.lstatSync(storyboardPath).isFile())
      .forEach((storyboardFilePath) => {
        const storyboard = loadStoryboard(storyboardFilePath);
        if (storyboard) {
          storyboards.push(storyboard);
        }
      });
  });

  return storyboards;
};

module.exports = {
  loadStoryboards,
};
