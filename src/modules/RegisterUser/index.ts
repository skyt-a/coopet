import { confirmRegister, ConfirmRegisterAction } from "./ConfirmRegister";

type Actions = ConfirmRegisterAction;

export type State = {
  userName: string;
  petName: string;
  photoURL: string;
};

const init = (): State => {
  return {
    userName: "",
    petName: "",
    photoURL: ""
  };
};

export const reducer = (state: State = init(), action: Actions) => {
  switch (action.type) {
    case "CONFIRM_REGISTER":
      return {
        userName: action.payload.userName,
        petName: action.payload.petName,
        photoURL: action.payload.photoURL
      };
    default:
      return state;
  }
};

export const actionCreator = {
  confirmRegister
};
