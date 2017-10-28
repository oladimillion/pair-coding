import { CODE } from "../types/types";
 

export function Code (state = {}, actions = {}){ 

  switch(actions.type){ 

    case CODE:
      return actions.payload;

    default:
      return state
  }
}

