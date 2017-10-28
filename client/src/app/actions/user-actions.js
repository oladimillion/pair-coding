import axios from "axios";
import SetAuthToken from '../utils/auth-token';
import jwtDecode from 'jwt-decode';

import { USER } from "../types/types";
import { LOGIN_INFO } from "../types/types";
import { REG_INFO } from "../types/types";
import { ClearSessionState } from "./session-actions";


export function SetCurrentUser(data){ 
  // saving user's data in the store
  return { 
    type: USER,
    payload: data
  }
}

export function SetLoginInfo(data){ 
  // handles login info from server
  return  { 
    type: LOGIN_INFO,
    payload: data 
  }
}

export function SetRegInfo(data){ 
  // handles registration info from server
  return  { 
    type: REG_INFO,
    payload: data 
  }
}

export function Logout(){
  return dispatch => {
    // removing token from local storage
    localStorage.removeItem('token');
    // removing token to request headers
    SetAuthToken();
    // displaying successful log out message
    dispatch(SetLoginInfo({
      success: true,
      message: "You are logged out successfully"
    }));
    // deleting user from User's store
    dispatch(SetCurrentUser({}));
    // deleting sessions from Session's store
    dispatch(ClearSessionState([]));
  }
}

export function LoginRequest(data){ 
  return dispatch => { 
    // making log in request to server
    return axios.post("/api/user/signin", data)
      .then(({ data }) => { 
        let { success, message, payload } = data;
        // setting token from local storage
        localStorage.setItem("token", payload);
        // setting token to request headers for authentication
        SetAuthToken(payload);
        // adding user to User's store
        dispatch(SetCurrentUser(jwtDecode(payload)));
        // displaying successful log in message
        dispatch(SetLoginInfo({ message, success }));
        // clearing any registration info message on screen
        dispatch(SetRegInfo({ message: "", success: true }));
        return data;
      })
      .catch(({ response }) => { 
        let { success, message } = response.data;
        // displaying unsuccessful log in message
        dispatch(SetLoginInfo({ message, success }));
        throw response;
      })
  }
}

export function RegRequest(data){ 
  return dispatch => { 
    // making registration request to server
    return axios.post("/api/user/signup", data)
      .then(({ data }) => { 
        let { success, message } = data;
        // displaying successful registration message
        dispatch(SetRegInfo({ message, success }));
        return data;
      })
      .catch(({ response }) => { 
        let { success, message } = response.data;
        // displaying unsuccessful registration message
        dispatch(SetRegInfo({ message, success }));
        throw response;
      });

  }
}

export function PasswordResetRequest(data){ 
  // resetting password request
  return dispatch => { 
    return axios.put("/api/user/password-reset", data)
  }
}

export function PasswordResetLinkRequest(data){ 
  // requesting password reset link
  return dispatch => { 
    return axios.post("/api/user/password-reset-link", data)
  }
}

export function ProfileUpdateRequest(data){ 
  return dispatch => { 
    // making request to update profile
    return axios.put("/api/user/profile-update", data)
      .then(({ data }) => { 
        let { payload } = data;
        if(payload){
          // setting token from local storage
          localStorage.setItem("token", payload);
          // setting token to request headers for authentication
          SetAuthToken(payload);
          // adding user to User's store
          dispatch(SetCurrentUser(jwtDecode(payload)));
          // clearing session state
          dispatch(ClearSessionState([]));
        }
        return data;
      })
      .catch((response) => { 
        throw response;
      })
  }
}

export function PasswordResetTokenRequest(token){ 
  // giving user a token for password reset 
  return dispatch => { 
    return axios.post("/api/user/password-reset-token/" + token)
  }
}
