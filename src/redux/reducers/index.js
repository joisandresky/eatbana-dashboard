import { combineReducers } from "redux";
import { userReducer } from "./userReducer";
import { reservationReducer } from "./reservationReducer";

export default combineReducers({
  userReducer,
  reservationReducer
});