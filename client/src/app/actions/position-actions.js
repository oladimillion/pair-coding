import { SET_POSITION } from "../types/types"

// registers position or page session items before home component unmounts
export function SetPosition(offset, limit, count){
  return {
    type: SET_POSITION,
    payload: {
      offset,
      limit,
      count
    }
  }
}
