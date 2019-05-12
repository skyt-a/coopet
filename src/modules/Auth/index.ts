import { login, LoginAction } from "./Login";
import { logout, LogoutAction } from "./Logout";

type Actions = LoginAction | LogoutAction;

export type State = {
  user: any;
};

const init = (): State => {
  return {
    user: null
  };
};

export const reducer = (state: State = init(), action: Actions) => {
  switch (action.type) {
    case "LOGIN":
      return {
        user: action.payload.user
      };
    case "LOGOUT":
      return {
        user: null
      };
    default:
      return state;
  }
};

export const actionCreator = {
  login,
  logout
};
