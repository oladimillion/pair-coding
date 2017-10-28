import { CHAT, CHATS, CLEAR_CHAT } from "../types/types"


export function Chat (state = [], actions = {}){ 

  switch(actions.type){ 

    case CHAT:
      let newState = [...state, actions.payload];
      return [...newState];

    case CHATS:
      return actions.payload;

    case CLEAR_CHAT:
      return [];

    default:
      return state
  }
}


