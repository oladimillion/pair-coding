import { CHAT, CHATS, CLEAR_CHAT } from "../types/types"

// process chat object
export function ProcessChat({ username, message, type, time }){ 
  return  { 
    type: CHAT,
    payload: { 
      username,
      type,
      message,
      time
    } 
  } 
} 

// process chat array
export function ProcessChats(data){ 
  return  { 
    type: CHATS,
    payload: data 
  } 
}

// process chats from redux store
export function ClearChat(){
  return {
    type: CLEAR_CHAT
  }
}
