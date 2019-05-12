import { combineReducers } from "redux";
import * as Auth from "./Auth";
import * as RegisterUser from "./RegisterUser";

export type RootState = {
  auth: Auth.State;
  registerUser: RegisterUser.State;
};

export const rootReducer = combineReducers({
  auth: Auth.reducer,
  registerUser: RegisterUser.reducer
});

export const actionCreator = {
  auth: Auth.actionCreator,
  registerUser: RegisterUser.actionCreator
};
