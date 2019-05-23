import { combineReducers } from "redux";
import Auth, { IAuthState } from "./Auth";
import RegisterUser, { State } from "./RegisterUser";
import App, { IAppState } from "./app";

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

// export const actionCreator = {
//   auth: Auth.actionCreator,
//   registerUser: RegisterUser.actionCreator
// };
// export { IAuthState } from "./Auth";
// export { State } from "./RegisterUser";
