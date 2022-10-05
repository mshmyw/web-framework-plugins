import fs from "fs";
import { sync } from "glob";

const loadStoryboard = (storyboardFilePath) => {
  let storyboard = null;

  const storyboardFileContent = fs.readFileSync(storyboardFilePath).toString();
  try {
    storyboard = JSON.parse(storyboardFileContent);
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.warn(
        `The content of "${storyboardFilePath}" is not JSON serializable!`
      );
    } else {
      console.warn(`Parse storyboard failed: ${error.message}`);
    }
  }

  // TODO(chenshaorui): Use a JSON schema validation library to validate the schema of storyboard file.

  return storyboard;
};

const loadStoryboards = (storyboardPathPatterns) => {
  const storyboards = [];

  storyboardPathPatterns.forEach((storyboardPathPattern) => {
    const storyboardPaths = sync(storyboardPathPattern);
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

export { loadStoryboards };
