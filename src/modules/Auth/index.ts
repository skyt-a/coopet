import { ActionCreator } from "typescript-fsa"; // Note: not from 'redux'
import { reducerWithInitialState } from "typescript-fsa-reducers";
import { authActions } from "../../actions";
import { UserInfo } from "../../models/UserInfo";

export interface IAuthState {
  user: UserInfo;
  additionalUserInfo: any;
  submitting: boolean;
  timestamp: number;
}
const INITIAL_AUTH_STATE: IAuthState = {
  user: null,
  additionalUserInfo: null,
  submitting: true,
  timestamp: 0
};

// async:
//   signUp, signIn, signOut, (syncState),
//   sendPasswordResetEmail
// sync:
//   stateChanged, initialize
export const reducer = reducerWithInitialState(INITIAL_AUTH_STATE)
  .cases(
    [
      authActions.signUp.started as ActionCreator<any>,
      authActions.signIn.started as ActionCreator<any>,
      authActions.signOut.started as ActionCreator<any>,
      authActions.sendPasswordResetEmail.started as ActionCreator<any>
    ],
    (state, action) => {
      return { ...state, submitting: true };
    }
  )
  .cases(
    [
      authActions.signUp.done as ActionCreator<any>,
      authActions.signUp.failed as ActionCreator<any>,
      authActions.signIn.done as ActionCreator<any>,
      authActions.signIn.failed as ActionCreator<any>,
      authActions.signOut.done as ActionCreator<any>,
      authActions.signOut.failed as ActionCreator<any>,
      authActions.sendPasswordResetEmail.done as ActionCreator<any>,
      authActions.sendPasswordResetEmail.failed as ActionCreator<any>,
      authActions.storeUserInfo.done as ActionCreator<any>,
      authActions.storeUserInfo.failed as ActionCreator<any>
    ],
    (state, action) => {
      return { ...state, submitting: false };
    }
  )
  .cases(
    [
      authActions.storeUserInfo.done as ActionCreator<any>,
      authActions.storeUserInfo.failed as ActionCreator<any>
    ],
    (state, action) => {
      if (!action.params) {
        return { ...state, submitting: false };
      }
      return {
        user: action.params.currentUser,
        additionalUserInfo: action.params.additionalUserInfo,
        submitting: false,
        timestamp: Date.now()
      };
    }
  )
  .cases(
    [
      /* substantially unnec. */
      // authActions.syncState.started as ActionCreator<any>,
      // authActions.syncState.done as ActionCreator<any>,
      // authActions.syncState.failed as ActionCreator<any>,
    ],
    (state, action) => {
      return { ...state };
    }
  )
  .caseWithAction(authActions.stateChanged, (state: any, action: any) => {
    return {
      ...state,
      user: action.payload,
      submitting: false,
      timestamp: Date.now()
    };
  })
  .case(authActions.initialize, (state: any) => {
    return INITIAL_AUTH_STATE;
  });

export default reducer;
