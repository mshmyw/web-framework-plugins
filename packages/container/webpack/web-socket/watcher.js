const chokidar = require("chokidar");

class Watcher {
  constructor(paths) {
    this._watcher = chokidar.watch(paths);
  }

  listenChangeEvent(callback) {
    this._watcher.on("change", callback);
  }
}

module.exports = {
  Watcher,
};
