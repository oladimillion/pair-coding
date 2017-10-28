import { SET_POSITION } from "../types/types"

const initialState = {offset: 0, limit: 10, count: 10};

export function Position (state = initialState, actions = {}){ 

  switch(actions.type){ 

    case SET_POSITION:
      return actions.payload

    default:
      return state
  }
}


