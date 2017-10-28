import Client from "../utils/socket-utils";
const io = require('socket.io-client');

// connecting to session_channel channel on server
let SessionChannel = io.connect("/session_channel");

// client object that provides means of sending and processing data from socket
const client = new Client;

export function ClientConnection(connectionData){
  return dispatch => {
    // connecting to server socket
    client.connection(SessionChannel, dispatch, connectionData);
  }
}

export function ClientLeftSession() {
  return dispatch => {
    // closing socket
    client.leaveSession()
  }
}

export function ClientSendMessage(data){ 
  return dispatch => {
    // sending message object to server
    client.sendMessage(data);
  }
}

export function ClientSendCode(data){
  return dispatch => {
    // sending code object to server
    client.sendCode(data);
  }
}

SessionChannel.on("code", (data) => {
  // processing code object from server
  client.onCode(data);
});

SessionChannel.on("connect", () => {
  // notifying client of successful connection to server
  client.onConnect();
});

SessionChannel.on("disconnect", () => {
  // notifying client of disconnection from server
  client.onDisconnect();
});

SessionChannel.on("error", () => {
  // notifying client of connection error to server
  client.onError();
});

SessionChannel.on("message", (data) => { 
  // processing message object from server
  client.onMessage(data);
});

SessionChannel.on("messages", (data) => { 
  // processing messages array from server
  client.onMessages(data);
});

SessionChannel.on("reconnect", () => {
  // notifying client of reconnection to server
  client.onReconnect();
});
