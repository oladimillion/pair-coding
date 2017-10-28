import { LOGIN_INFO } from "../types/types"
import { REG_INFO } from "../types/types"
import { USER } from "../types/types"

export function User (state = {}, actions = {}){ 

  switch(actions.type){ 

    case USER:
      return actions.payload

    default:
      return state
  }
}


export function LoginInfo (state = {}, actions = {}){ 

  switch(actions.type){ 

    case LOGIN_INFO:
      return actions.payload

    default:
      return state
  }
}

export function RegInfo (state = {}, actions = {}){ 

  switch(actions.type){ 

    case REG_INFO:
      return actions.payload

    default:
      return state
  }
}


