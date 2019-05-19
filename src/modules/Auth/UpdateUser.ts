import { Action } from "redux";

// Action CreatorとReducerをひとまとめに
export type UpdateUserPayload = {
  user: any;
};

export interface UpdateUserAction extends Action {
  type: "UPDATE_USER";
  payload: UpdateUserPayload;
}

export const updateUser = (payload: UpdateUserPayload): UpdateUserAction => {
  return {
    payload,
    type: "UPDATE_USER"
  };
};
