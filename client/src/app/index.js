//import "babel-polyfill";

import React from "react";
import { render } from "react-dom";
import { Router, browserHistory } from "react-router";
import thunk from "redux-thunk";
import { createStore, applyMiddleware, compose} from "redux";
import rootReducer from "./root-reducer";
import Root from "./root";
import SetAuthToken from "./utils/auth-token";
import jwtDecode from "jwt-decode";
import { SetCurrentUser } from "./actions/user-actions";

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
)


if(localStorage.token){
  SetAuthToken(localStorage.token);
  store.dispatch(SetCurrentUser(jwtDecode(localStorage.token)));
}

// store.subscribe(()=> console.log(store.getState()));

render( 
  <Root store={store}/>,
  document.getElementById("app")
);


