let io = require("socket.io");
const Client = require("../utils/socket-utils");


exports.initialise = (http) => {

  io = io.listen(http);
  this.client = new Client;

  this.sessionChannel = io.of("/session_channel")
    .on("connection", (socket) => {

      socket.on("add member", (connectionData) => {
        this.client.onJoin(this.sessionChannel, socket, connectionData);
      });

      socket.on("message", (data) => {
        this.client.onMessage(socket, data) ;
      });

      socket.on("code", (data) => {
        this.client.onCode(socket, data) ;
      });

      socket.on("disconnect", () => {
        this.client.onDisconnect(socket);
      })

    })
}


