const {formatTimeToGMT} = require("./time-format");

class Client 
{
  constructor() 
  {
    // keeps track session content
    this.sessionContentMap = new Map;
    // keeps track session conversation
    this.sessionChatMap = new Map;
    // keep list of connected members and there respective sessions 
    this.sessionAndMemberList = new Map;
  }

  broadcastMessage(socket, message, time) 
  {
    // Broadcast message to every connected peers
    socket.in(socket.sessionId).broadcast.emit("message", 
      JSON.stringify({
        username: "Server",
        type: "friend",
        message,
        time: formatTimeToGMT(),
      }));
  }

  emitMappedData(socket, event, map)
  {
    // Broadcast code to newly connected client
    const sessionId = socket.sessionId
    const value = map.get(sessionId);
    if(value && event == "code"){
      socket.emit(event, JSON.stringify(value));
    } else if (value && event == "messages"){
      socket.emit(event, value);
    }
  }

  
  joinSession(connectionData)
  {
    // user joins session
    let {username, sessionId} = connectionData;
    let value = this.sessionAndMemberList.get(sessionId);
    if(!value){
      value = new Set;
      value.add(username);
      this.sessionAndMemberList.set(sessionId, value);
    } else {
      value.add(username);
      this.sessionAndMemberList.set(sessionId, value);
    }
  }

  leaveSession(connectionData)
  {
    // user leaves session
    let {username, sessionId} = connectionData;
    let value = this.sessionAndMemberList.get(sessionId);
    if(!value){
      return true;
    } else {
      value.delete(username);
      if(value.size){
        // there remain connections in the session
        this.sessionAndMemberList.set(sessionId, value);
        return false;
      } else {
        // no more connection in the session with
        // with specified id so, remove from session map
        this.sessionAndMemberList.delete(sessionId);
        return true;
      }
    }
  }

  onCode(socket, data){
    data = JSON.parse(data);
    data.type = "friend"
    // handles real time code dispatch
    socket.in(socket.sessionId).broadcast.emit("code", JSON.stringify(data));
    // keeps track of session content
    this.sessionContentMap.set(socket.sessionId, data);
  }

  onDisconnect(socket){
    // removing client id from socket pool
    socket.id = null;
    // notify peers about a member's departure 
    this.broadcastMessage(socket, socket.username + " has left")
    // if nobody in session, delete session and session data
    let sessionIsEmpty = this.leaveSession({
      username: socket.username,
      sessionId: socket.sessionId
    });
    // removing client username from socket pool
    socket.username = null;
    if(sessionIsEmpty){
      this.sessionContentMap.delete(socket.sessionId);
      this.sessionChatMap.delete(socket.sessionId);
      // if no more peer in session, remove sessionId from socket pool
      socket.sessionId = null;
    }

  }

  onJoin(sessionChannel, socket, connectionData)
  {
    if(!connectionData.username && !connectionData.sessionId){
      // connection is only established when username and sessionId 
      // are provided
      return;
    }
    // adds member into a session
    // let inSession = this.joinSession(connectionData)
    this.joinSession(connectionData)
    // we store the username in the socket session 
    socket.username = connectionData.username;
    // connecting peers to their respective sessions
    socket.join(connectionData.sessionId);
    const comSocket = sessionChannel.sockets[socket.id];
    comSocket.join(connectionData.sessionId);
    comSocket.sessionId = connectionData.sessionId;
    // updates connected member with session data 
    this.emitMappedData(socket, "code", this.sessionContentMap);
    this.emitMappedData(socket, "messages", this.sessionChatMap);

    // send a welcome message to connected member
    socket.emit("message", JSON.stringify({
      username: "Server",
      type: "friend",
      message: "Welcome " + connectionData.username,
      time: formatTimeToGMT(),
    }));
    // notify peers of a members presence
    this.broadcastMessage(socket, connectionData.username + " has joined");
  }

  onMessage(socket, data)
  {
    data = JSON.parse(data);
    let {username, type, message, time} = data;
    // make message available to the client
    socket.send(JSON.stringify({username: "me", type, message, time}));
    // make message available to connected peers
    data.type = "friend"
    // handles real time message dispatch
    socket.in(socket.sessionId).broadcast.send(JSON.stringify(data));
    // keeps tracks of session conversation
    let value = this.sessionChatMap.get(socket.sessionId);
    if(value){
      value.push(data);
      this.sessionChatMap.set(socket.sessionId, value);
    } else {
      this.sessionChatMap.set(socket.sessionId, [data]);
    }
  }
}

module.exports = Client; 

