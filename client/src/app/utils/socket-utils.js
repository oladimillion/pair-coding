import { ProcessChat, ClearChat } from "../actions/chat-actions"
import { ProcessChats } from "../actions/chat-actions"
import { ProcessCode } from "../actions/editor-actions"
import { SetSessionInfo } from "../actions/session-actions"
import { formatTimeToGMT } from "../../../../server/utils/time-format"
import { formatTimeToLocale } from "../../../../server/utils/time-format"

class Client
{
  constructor()
  {
    this.sessionChannel = null;
    this.dispatch = null;
    this.connectionData = {};
  }

  connection(SessionChannel, dispatch, ConnectionData)
  {
    this.sessionChannel = SessionChannel;
    this.dispatch = dispatch;
    this.connectionData = ConnectionData;

    // create connection
    this.sessionChannel.open();
    this.sessionChannel.emit("add member", this.connectionData);
  }

  leaveSession()
  {
    // close connection
    this.sessionChannel.close();
    // clear connectiondata
    this.connectionData = {};
    // clear conversations
    this.dispatch(ClearChat())
  }

  onCode(data)
  {
    this.dispatch(ProcessCode(JSON.parse(data)));
  }

  onConnect()
  {
    if(this.dispatch)
      this.dispatch(SetSessionInfo({ success: "true", message: "Connected to server" }));
  }

  onDisconnect()
  {
    if(this.dispatch)
      this.dispatch(SetSessionInfo({ 
        success: "false", 
        message: "Disconnected from server" 
      }));
  }

  onError()
  {
    this.dispatch(SetSessionInfo({ success: "false", message: "Couldn't connect to server" }));
  }

  onMessage(data)
  {
    data = JSON.parse(data);
    const { username, type, message, time } = data;
    if(type == "self"){
      // message delivered status
      this.dispatch(SetSessionInfo({
        success: true,
        message: "sent"
      }));
      return;
    }

    const _time = formatTimeToLocale(time);

    this.dispatch(ProcessChat({ username, type, message, time: _time }));
  }

  onMessages(data)
  {
    const _data = data.map((item) => {
      item.time = formatTimeToLocale(item.time);
      return item;
    });

    this.dispatch(ProcessChats(_data));
  }

  onReconnect()
  {
    if(this.dispatch){
      this.dispatch(SetSessionInfo({ success: "false", message: "Reconnecting to server" }));
      this.sessionChannel.emit("add member", this.connectionData);
    }
  }

  sendCode(data)
  {
    this.sessionChannel.emit("code", JSON.stringify(data))
  }

  sendMessage(data)
  {
    this.dispatch(ProcessChat(data));
    data.time = formatTimeToGMT(data.time);
    this.sessionChannel.emit("message", JSON.stringify(data));
  }
}


export default Client;
