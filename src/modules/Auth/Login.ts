import { Action } from "redux";

// Action CreatorとReducerをひとまとめに
export type LoginPayload = {
  user: any;
};

export interface LoginAction extends Action {
  type: "LOGIN";
  payload: LoginPayload;
}

export const login = (payload: LoginPayload): LoginAction => {
  return {
    payload,
    type: "LOGIN"
  };
};
