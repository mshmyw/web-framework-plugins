const ws = require("ws");

class WebSocketServer {
  constructor(port) {
    this._server = new ws.Server({ port }, () => {});
  }

  sendReloadCommand() {
    this.sendCommand("reload");
  }

  sendCommand(command) {
    this._server.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(command);
      }
    });
  }
}

module.exports = {
  WebSocketServer,
};
