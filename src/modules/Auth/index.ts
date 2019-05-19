import { updateUser, UpdateUserAction } from "./UpdateUser";

type Actions = UpdateUserAction;

export type State = {
  user: any;
};

const init = (): State => {
  return {
    user: null
  };
};

export const reducer = (state: State = init(), action: Actions) => {
  console.log(action);
  switch (action.type) {
    case "UPDATE_USER":
      return {
        user: action.payload
      };
    default:
      return state;
  }
};

export const actionCreator = {
  updateUser
};
