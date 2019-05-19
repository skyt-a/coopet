import { Action } from "redux";

// Action CreatorとReducerをひとまとめに
export type ConfirmRegisterPayload = {
  userName: string;
  petName: string;
  photoURL: string;
  uploadedImage: any;
  follow: any[];
  follower: any[];
};

export interface ConfirmRegisterAction extends Action {
  type: "CONFIRM_REGISTER";
  payload: ConfirmRegisterPayload;
}

export const confirmRegister = (
  payload: ConfirmRegisterPayload
): ConfirmRegisterAction => {
  return {
    payload,
    type: "CONFIRM_REGISTER"
  };
};
