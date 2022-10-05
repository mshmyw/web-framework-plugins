const chokidar = require("chokidar");

class Watcher {
  _watcher;
  constructor(paths) {
    this._watcher = chokidar.watch(paths);
  }

  listenChangeEvent(callback) {
    this._watcher.on("change", callback);
  }
}

export {Watcher};