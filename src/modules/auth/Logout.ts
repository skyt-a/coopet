import { Action } from "redux";

export interface LogoutAction extends Action {
  type: "LOGOUT";
  payload: { user: null };
}

export const logout = (): LogoutAction => {
  return {
    payload: { user: null },
    type: "LOGOUT"
  };
};
