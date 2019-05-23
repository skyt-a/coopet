import { confirmRegister, ConfirmRegisterAction } from "./ConfirmRegister";

type Actions = ConfirmRegisterAction;

export type State = {
  userName: string;
  petName: string;
  photoURL: string;
  uploadedImage: any;
  follow: any[];
  follower: any[];
};

const init = (): State => {
  return {
    userName: "",
    petName: "",
    photoURL: "",
    uploadedImage: null,
    follow: [],
    follower: []
  };
};

export const reducer = (state: State = init(), action: Actions) => {
  switch (action.type) {
    case "CONFIRM_REGISTER":
      return {
        userName: action.payload.userName,
        petName: action.payload.petName,
        photoURL: action.payload.photoURL,
        uploadedImage: action.payload.uploadedImage,
        follow: action.payload.follow,
        follower: action.payload.follower
      };
    default:
      return state;
  }
};

export const actionCreator = {
  confirmRegister
};

export default reducer;
