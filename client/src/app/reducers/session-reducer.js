import shortid from "shortid";

import { ADD_NEW_SESSION } from "../types/types";
import { SESSION_INFO,  } from "../types/types";
import { DELETE_SESSION } from "../types/types";
import { UPDATE_SESSION, UPDATE_SESSION_DETAIL } from "../types/types";
import { UPDATE_SESSION_STATE, CLEAR_SESSION_STATE } from "../types/types";


export function Sessions(state = [], actions = {}){ 

  switch(actions.type){ 

    case UPDATE_SESSION_STATE: { 
      return  [
        ...actions.payload
      ];    
    }

    case ADD_NEW_SESSION: { 
      return  [
        ...state,
        actions.payload
      ];    
    }

    case UPDATE_SESSION: { 
      let nextState = state;
      let { id, content, time } = actions.payload;
      nextState = nextState.map((session) => { 
        if(session.id  == id){ 
          session.content = content;
          session.time = time;
        }
        return session;
      });
      return nextState
    }

    case UPDATE_SESSION_DETAIL: { 
      let nextState = state;
      let { id, title, description } = actions.payload;
      nextState = nextState.map((session) => { 
        if(session.id  == id){ 
          session.title = title;
          session.description = description;
        }
        return session;
      });
      return nextState
    }

    case DELETE_SESSION: { 
      let nextState = state;
      let { id } = actions.payload;
      nextState = nextState.filter((session) => { 
        return (session.id != id);
      });
      return nextState
    }

    case CLEAR_SESSION_STATE: { 
      return [];
    }

    default:
      return state;
  }
}


export function SessionInfo(state = {}, actions = {}){ 

  switch(actions.type){ 

    case SESSION_INFO:
      return  actions.payload

    default:
      return state;

  }
}
