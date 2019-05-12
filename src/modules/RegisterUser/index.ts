import { confirmRegister, ConfirmRegisterAction } from "./ConfirmRegister";

type Actions = ConfirmRegisterAction;

export type State = {
  userName: string;
  petName: string;
};

const init = (): State => {
  return {
    userName: "",
    petName: ""
  };
};

export const reducer = (state: State = init(), action: Actions) => {
  switch (action.type) {
    case "CONFIRM_REGISTER":
      return {
        userName: action.payload.userName,
        petName: action.payload.petName
      };
    default:
      return state;
  }
};

export const actionCreator = {
  confirmRegister
};
