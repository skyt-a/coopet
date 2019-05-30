import { takeEvery, takeLatest, all } from "redux-saga/effects";
import { ActionTypes } from "../actions";
import appSaga from "./App/app";
import authSaga from "./Auth/auth";
import uploadSaga from "./Upload/upload";
import followSaga from "./Follow/follow";

export default function* rootSaga(): IterableIterator<any> {
  yield all([
    authSaga.checkUserStateSaga(),
    takeLatest(ActionTypes.APP_INITIALIZE, appSaga.initialize),

    takeEvery(`${ActionTypes.AUTH_SIGN_UP}_STARTED`, authSaga.signUp),
    takeEvery(`${ActionTypes.AUTH_SIGN_IN}_STARTED`, authSaga.signIn),
    takeEvery(`${ActionTypes.AUTH_SIGN_OUT}_STARTED`, authSaga.signOut),
    takeEvery(`${ActionTypes.AUTH_SYNC_STATE}_STARTED`, authSaga.syncState),
    takeEvery(
      `${ActionTypes.AUTH_UPDATE_USERINFO}_STARTED`,
      authSaga.updateUserInfo
    ),
    takeEvery(
      `${ActionTypes.AUTH_SEND_PASSWORD_RESET_EMAIL}_STARTED`,
      authSaga.sendPasswordResetEmail
    ),
    takeEvery(`${ActionTypes.STORE_USERINFO}_STARTED`, authSaga.storeUserInfo),
    takeEvery(`${ActionTypes.UPLOAD_IMAGE}_STARTED`, uploadSaga.uploadImage),
    takeEvery(`${ActionTypes.COMMENT_IMAGE}_STARTED`, uploadSaga.commentImage),

    takeEvery(`${ActionTypes.FOLLOW}_STARTED`, followSaga.follow),
    takeEvery(`${ActionTypes.UNFOLLOW}_STARTED`, followSaga.unfollow)
  ]);
}
