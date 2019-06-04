import actionCreatorFactory from "typescript-fsa";
import { AppError } from "../models/AppError";
import { AppInfo } from "../models/AppInfo";
import { SigningInfo } from "../models/SigningInfo";

const actionCreator = actionCreatorFactory();

/**
 * このアプリケーションのAction
 */
export enum ActionTypes {
  // アプリケーション初期化
  APP_INITIALIZE = "APP/INITIALIZE",
  // エラー情報プッシュ
  APP_PUSH_ERRORS = "PUSH_ERRORS",
  // エラー情報クリア
  APP_CLEAR_ERRORS = "CLEAR_ERRORS",
  // インフォプッシュ
  APP_PUSH_INFOS = "PUSH_INFOS",
  // インフォクリア
  APP_CLEAR_INFOS = "CLEAR_INFOS",
  // サインアップ
  AUTH_SIGN_UP = "SIGN_UP",
  // ログイン
  AUTH_SIGN_IN = "LOGIN",
  // ログアウト
  AUTH_SIGN_OUT = "LOGOUT",
  // 認証状態同期
  AUTH_SYNC_STATE = "SYNC_STATE",
  // 登録完了
  AUTH_UPDATE_USERINFO = "CONFIRM_REGISTER",
  // パスワードとメールアドレス送付
  AUTH_SEND_PASSWORD_RESET_EMAIL = "SEND_PASSWORD_RESET_EMAIL",
  // 認証状態変更
  AUTH_STATE_CHANGED = "STATE_CHANGED",
  // 認証初期化
  AUTH_INITIALIZE = "AUTH/INITIALIZE",
  // 画像アップロード
  UPLOAD_IMAGE = "UPLOAD_IMAGE",
  // 画像削除
  DELETE_IMAGE = "DELETE_IMAGE",
  // 画像へのコメント
  COMMENT_IMAGE = "COMMENT_IMAGE",
  // 画像へいいね
  LIKE_IMAGE = "LIKE_IMAGE",
  // 画像へのいいね解除
  DISLIKE_IMAGE = "DISLIKE_IMAGE",
  // アップロード処理初期化
  UPLOAD_INITIALIZE = "UPLOAD_INITIALIZE",
  // ユーザー情報保存
  STORE_USERINFO = "STORE_USERINFO",
  // 他ユーザー選択
  SELECT_USER = "SELECT_USER",
  // 他ユーザー選択解除
  UNSELECT_USER = "UNSELECT_USER",
  // フォロー
  FOLLOW = "FOLLOW",
  // フォロー解除
  UNFOLLOW = "UNFOLLOW"
}

/**
 * このアプリケーションのActionCreaterたち
 */
export const appActions = {
  initialize: actionCreator(ActionTypes.APP_INITIALIZE),
  pushErrors: actionCreator<AppError[]>(ActionTypes.APP_PUSH_ERRORS),
  clearErrors: actionCreator(ActionTypes.APP_CLEAR_ERRORS),
  pushInfos: actionCreator<AppInfo[]>(ActionTypes.APP_PUSH_INFOS),
  clearInfos: actionCreator(ActionTypes.APP_CLEAR_INFOS),
  selectUser: actionCreator(ActionTypes.SELECT_USER),
  unselectUser: actionCreator(ActionTypes.UNSELECT_USER)
};
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
  deleteImage: actionCreator.async<any, boolean, any>(ActionTypes.DELETE_IMAGE),
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
