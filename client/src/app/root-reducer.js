import { combineReducers } from "redux";

import { User } from "./reducers/user-reducer";
import { LoginInfo } from "./reducers/user-reducer";
import { RegInfo } from "./reducers/user-reducer";
import { Sessions } from "./reducers/session-reducer";
import { SessionInfo } from "./reducers/session-reducer";
import { Chat } from "./reducers/chat-reducer";
import { Code } from "./reducers/editor-reducer";
import { Position } from "./reducers/position-reducer";

export default combineReducers({
  User,
  LoginInfo,
  RegInfo,
  Sessions,
  SessionInfo,
  Chat,
  Code,
  Position
})
