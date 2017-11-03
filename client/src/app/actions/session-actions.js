import axios from "axios";

import { ADD_NEW_SESSION } from "../types/types";
import { SESSION_INFO } from "../types/types";
import { UPDATE_SESSION, UPDATE_SESSION_DETAIL } from "../types/types";
import { DELETE_SESSION } from "../types/types";
import { UPDATE_SESSION_STATE, CLEAR_SESSION_STATE }  from "../types/types";

export function ClearSessionState(){ 
  // clears all sessions from redux store
  return { 
    type: CLEAR_SESSION_STATE,
  }
}

export function DeleteSession(id){ 
  // delete session from redux store by id
  return { 
    type: DELETE_SESSION,
    payload: {id}
  }
}

export function UpdateSessionState(data){ 
  // populate redux store with data from server
  return { 
    type: UPDATE_SESSION_STATE,
    payload: data
  }
}

export function AddNewSession(data){ 
  //creates new session locally on redux store
  return  { 
    type: ADD_NEW_SESSION,
    payload: data 
  }
}

export function UpdateSession({ id, content, time }){ 
  // update a particular session locally in redux store
  return { 
    type: UPDATE_SESSION,
    payload: { 
      id,
      time,
      content 
    }
  }
}
export function UpdateSessionDetail(data){ 
  // update a particular session detail in redux store
  return { 
    type: UPDATE_SESSION_DETAIL,
    payload: data
  }
}

export function SetSessionInfo({ success, message }){ 
  // displays or removes sessions info banner
  return  { 
    type: SESSION_INFO,
    payload: { 
      success,
      message
    }
  }
}

export function FetchAllSessionRequest({ username }){ 
  // fetches all sessions from the server based username provided
  return dispatch => { 
    return axios.get(`/api/session/fetch-all?username=${ username }`)
      .then(({ data, headers }) => { 
        // update redux store
        dispatch(UpdateSessionState(data.payload));
        return data; 
      })
      .catch(({ response }) => { 
        let {  success, message  } = response.data;
        // dispatch error message
        dispatch(SetSessionInfo({ success, message }));
        throw response;
      })
  }
}

export function AddNewSessionRequest(data){ 
  //creates new session on the server
  const {  username, title, id, content, time  } = data;
  return dispatch => { 
    // axios request to add new session 
    return axios.post("/api/session/create", data)
      .then(({ data }) => { 
        // add new session to redux store
        dispatch(AddNewSession({ username, title, id, content, time }));
        // dispatch success message
        dispatch(SetSessionInfo(data));
        return data;
      })
      .catch(({ response }) => { 
        let {  success, message  } = response.data;
        // dispatch error message
        dispatch(SetSessionInfo({ message, success }));
        throw response;
      })
  }
}

export function FetchOneSessionRequest({ id }){ 
  // fetches a lone session from the server based id provided
  return dispatch => { 
    return axios.get(`/api/session/fetch-one/${ id }`)
  }
}

export function UpdateSessionRequest(data){ 
  // updates a session one the server based on data provided
  return dispatch => { 
    // axios request to update session on the server
    return axios.put("/api/session/update-session", data)
      .then((response) => { 
        // update redux store 
        dispatch(UpdateSession(data))
        let {  success, message  } = response.data;
        // dispatch success message
        dispatch(SetSessionInfo({ message, success }));
        return  response;
      })
      .catch(({ response }) => { 
        let {  success, message  } = response.data;
        // dispatch error message
        dispatch(SetSessionInfo({ message, success }));
        // throw response;
      })
  }
}


export function UpdateSessionDetailRequest(data){ 
  // updates session detail on the sever
  return dispatch => {
    return axios.put("/api/session/update-session-detail", data)
      .then((response) => { 
        // update session detail on redux store 
        dispatch(UpdateSessionDetail(data))
        return  response;
      })
  }
}

export function DeleteSessionRequest(id){ 
  // deletes session from the sever
  return dispatch => {
    return axios.delete(`/api/session/delete-session/${id}`)
      .then((response) => { 
        // deletes session from redux store
        dispatch(DeleteSession(id))
        let {  success, message  } = response.data;
        // dispatch success message
        dispatch(SetSessionInfo({ message, success }));
        return  response;
      })
      .catch(({response}) => { 
        let {  success, message  } = response.data;
        // dispatch error message
        dispatch(SetSessionInfo({ message, success }));
        throw response;
      })

  }
}
