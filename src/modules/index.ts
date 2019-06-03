import { combineReducers } from "redux";
import Auth, { IAuthState } from "./Auth";
import RegisterUser, { State } from "./RegisterUser";
import App, { IAppState } from "./App";

export type RootState = {
  App: IAppState;
  Auth: IAuthState;
  ResgisterUser: State;
};

export const rootReducer = combineReducers({
  Auth,
  RegisterUser,
  App
});
