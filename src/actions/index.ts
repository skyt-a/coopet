/**
 * flux-standard-action
 * {
 *   type: FOO_TYPE,                          // must
 *   payload: {object},                       // optional
 *   meta: {object},                          // optional
 *   error: false, true, undefined, null, ... // optional
 * }
 */
import actionCreatorFactory from "typescript-fsa";
import { AppError } from "../models/AppError";
import { AppInfo } from "../models/AppInfo";
import { SigningInfo } from "../models/SigningInfo";

const actionCreator = actionCreatorFactory();

export enum ActionTypes {
  APP_INITIALIZE = "APP/INITIALIZE",
  APP_PUSH_ERRORS = "APP/PUSH_ERRORS",
  APP_CLEAR_ERRORS = "APP/CLEAR_ERRORS",
  APP_PUSH_INFOS = "APP/PUSH_INFOS",
  APP_CLEAR_INFOS = "APP/CLEAR_INFOS",

  AUTH_SIGN_UP = "AUTH/SIGN_UP",
  AUTH_SIGN_IN = "LOGIN",
  AUTH_SIGN_OUT = "LOGOUT",
  AUTH_SYNC_STATE = "AUTH/SYNC_STATE",

  AUTH_UPDATE_USERINFO = "CONFIRM_REGISTER",
  AUTH_SEND_PASSWORD_RESET_EMAIL = "AUTH/SEND_PASSWORD_RESET_EMAIL",

  AUTH_STATE_CHANGED = "AUTH/STATE_CHANGED",
  AUTH_INITIALIZE = "AUTH/INITIALIZE",
  UPLOAD_IMAGE = "UPLOAD_IMAGE",
  COMMENT_IMAGE = "COMMENT_IMAGE",
  LIKE_IMAGE = "LIKE_IMAGE",
  DISLIKE_IMAGE = "DISLIKE_IMAGE",
  UPLOAD_INITIALIZE = "UPLOAD_INITIALIZE",
  STORE_USERINFO = "STORE_USERINFO",
  SELECT_USER = "SELECT_USER",
  UNSELECT_USER = "UNSELECT_USER",

  FOLLOW = "FOLLOW",
  UNFOLLOW = "UNFOLLOW"
}

// app
export const appActions = {
  initialize: actionCreator(ActionTypes.APP_INITIALIZE),
  pushErrors: actionCreator<AppError[]>(ActionTypes.APP_PUSH_ERRORS),
  clearErrors: actionCreator(ActionTypes.APP_CLEAR_ERRORS),
  pushInfos: actionCreator<AppInfo[]>(ActionTypes.APP_PUSH_INFOS),
  clearInfos: actionCreator(ActionTypes.APP_CLEAR_INFOS),
  selectUser: actionCreator(ActionTypes.SELECT_USER),
  unselectUser: actionCreator(ActionTypes.UNSELECT_USER)
};

// auth
export const authActions = {
  signUp: actionCreator.async<
    SigningInfo, // parameter type
    boolean, // success type
    any // error type
  >(ActionTypes.AUTH_SIGN_UP),

  signIn: actionCreator.async<SigningInfo, boolean, any>(
    ActionTypes.AUTH_SIGN_IN
  ),

  signOut: actionCreator.async<undefined, boolean, any>(
    ActionTypes.AUTH_SIGN_OUT
  ),

  syncState: actionCreator.async<number | undefined, boolean, any>(
    ActionTypes.AUTH_SYNC_STATE
  ),

  updateUserInfo: actionCreator.async<any, boolean, any>(
    ActionTypes.AUTH_UPDATE_USERINFO
  ),

  sendPasswordResetEmail: actionCreator.async<string, boolean, any>(
    ActionTypes.AUTH_SEND_PASSWORD_RESET_EMAIL
  ),

  stateChanged: actionCreator<any>(ActionTypes.AUTH_STATE_CHANGED),

  initialize: actionCreator(ActionTypes.AUTH_INITIALIZE),

  storeUserInfo: actionCreator.async<any, boolean, any>(
    ActionTypes.STORE_USERINFO
  )
};

export const uploadActions = {
  uploadImage: actionCreator.async<any, boolean, any>(ActionTypes.UPLOAD_IMAGE),
  commentImage: actionCreator.async<any, boolean, any>(
    ActionTypes.COMMENT_IMAGE
  ),
  likeImage: actionCreator.async<any, boolean, any>(ActionTypes.LIKE_IMAGE),
  dislikeImage: actionCreator.async<any, boolean, any>(
    ActionTypes.DISLIKE_IMAGE
  ),
  initialize: actionCreator(ActionTypes.UPLOAD_INITIALIZE)
};

export const followActions = {
  follow: actionCreator.async<any, boolean, any>(ActionTypes.FOLLOW),
  unfollow: actionCreator.async<any, boolean, any>(ActionTypes.UNFOLLOW)
};
