const wbSock = require("ws");
const { v4: uuid } = require("uuid");
class WebSocket {
  constructor(server) {
    this.clients = [];
    this.messages = [];
    _initialize(server);
  }

  _initialize(server) {
    this.ws = new wbSock.Server(server);
  }
  _handleConnection() {
    this.ws.on("connection", (newSocket) => {
      this.clients.push(uuid());
      this.ws.on("message", (message) => {
        console.log("received %s", message);
      });
    });
  }
}
