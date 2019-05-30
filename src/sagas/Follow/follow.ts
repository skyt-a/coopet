// tslint:disable: no-else-after-return
// tslint:disable
/* eslint no-throw-literal: 0 */
/* eslint require-yield: 0 */

import { Action } from "typescript-fsa";
import { put } from "redux-saga/effects";
import firebase, { database } from "../../firebase";
import { appActions, followActions } from "../../actions";
import { isIAuthError } from "../../models/AuthError";
import { Severity } from "../../models/Severity";
import AppErrorUtil from "../../utils/AppErrorUtil";

const followSaga = {
  follow: function*(action: Action<any>): IterableIterator<any> {
    console.log("followSaga: follow start.");
    let profile = action.payload;
    const currentUser = firebase.auth().currentUser;
    if (!currentUser) {
      console.log(`user not signed in`);
      throw {
        code: "user not signed in",
        message: "this operation requires user to be signed in."
      };
    }
    try {
      yield database
        .ref(`/following/${currentUser.uid}/${profile.uid}`)
        .set(true, error => {
          console.log(error);
          if (error) {
            console.error(error);
          } else {
          }
        });
      yield database
        .ref(`/follower/${profile.uid}/${currentUser.uid}`)
        .set(true, error => {
          console.log(error);
          if (error) {
            console.error(error);
          } else {
          }
        });
    } catch (err) {
      yield put(
        followActions.follow.failed({ params: action.payload, error: err })
      );
      const appError = AppErrorUtil.toAppError(err, {
        name: "followSaga",
        stack: JSON.stringify(err),
        severity: isIAuthError(err) ? Severity.WARNING : Severity.FATAL
      });
      yield put(appActions.pushErrors([appError]));
    } finally {
      console.log("followSaga: follow end.");
    }
  },
  unfollow: function*(action: Action<any>): IterableIterator<any> {
    console.log("followSaga: unfollow start.");
    let profile = action.payload;
    const currentUser = firebase.auth().currentUser;
    if (!currentUser) {
      console.log(`user not signed in`);
      throw {
        code: "user not signed in",
        message: "this operation requires user to be signed in."
      };
    }
    try {
      yield database
        .ref(`/following/${currentUser.uid}/${profile.uid}`)
        .remove();
      yield database
        .ref(`/follower/${profile.uid}/${currentUser.uid}`)
        .remove();
    } catch (err) {
      yield put(
        followActions.unfollow.failed({ params: action.payload, error: err })
      );
      const appError = AppErrorUtil.toAppError(err, {
        name: "followSaga",
        stack: JSON.stringify(err),
        severity: isIAuthError(err) ? Severity.WARNING : Severity.FATAL
      });
      yield put(appActions.pushErrors([appError]));
    } finally {
      console.log("followSaga: unfollow end.");
    }
  }
};
export default followSaga;
