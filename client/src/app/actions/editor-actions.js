import { CODE } from "../types/types"

// process code object to be displayed by editor
export function ProcessCode(data){ 
  return  { 
    type: CODE,
    payload: data 
  } 
}


