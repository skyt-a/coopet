import { combineReducers } from "redux";
import Auth, { IAuthState } from "./Auth";
import RegisterUser, { State } from "./RegisterUser";
import App from "./app";

export type RootState = {
  auth: IAuthState;
  registerUser: State;
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
