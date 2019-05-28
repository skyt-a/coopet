// tslint:disable: no-else-after-return
// tslint:disable
/* eslint no-throw-literal: 0 */
/* eslint require-yield: 0 */

import { Action } from "typescript-fsa";
import { put } from "redux-saga/effects";
import firebase, { database, storage } from "../../firebase";
import { appActions, uploadActions } from "../../actions";
import { isIAuthError } from "../../models/AuthError";
import { Severity } from "../../models/Severity";
import AppErrorUtil from "../../utils/AppErrorUtil";
import KeyCreater from "../../utils/KeyCreater";

const uploadSaga = {
  uploadImage: function*(action: Action<any>): IterableIterator<any> {
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
      if (profile.uploadedImage) {
        const key = KeyCreater.create(currentUser.uid);
        const ref = storage.ref().child(`photoURL:${currentUser.uid}:${key}`);
        yield ref.put(profile.uploadedImage);
        let targetURL;
        yield ref.getDownloadURL().then(url => {
          targetURL = url;
        });
        yield database.ref(`/uploadedImage/${key}`).set(
          {
            url: targetURL,
            comment: profile.comment,
            petSpecies: profile.petSpecies,
            uid: currentUser.uid
          },
          error => {
            console.error(error);
            if (error) {
              console.error(error);
            } else {
            }
          }
        );
        yield database.ref(`/users/${currentUser.uid}/uploadImage/${key}`).set(
          {
            url: targetURL,
            comment: profile.comment
          },
          error => {
            console.error(error);
            if (error) {
              console.error(error);
            } else {
            }
          }
        );
      }
    } catch (err) {
      yield put(
        uploadActions.uploadImage.failed({ params: action.payload, error: err })
      );
      const appError = AppErrorUtil.toAppError(err, {
        name: "uploadImage",
        stack: JSON.stringify(err),
        severity: isIAuthError(err) ? Severity.WARNING : Severity.FATAL
      });
      yield put(appActions.pushErrors([appError]));
    } finally {
      console.log("uploadSaga: uploadImage end.");
    }
  },
  commentImage: function*(action: Action<any>): IterableIterator<any> {
    console.log("uploadSaga: uploadImage start.");
    let profile = action.payload;
    const currentUser = firebase.auth().currentUser;
    if (!currentUser) {
      console.log(`user not signed in`);
      throw {
        code: "user not signed in",
        message: "this operation requires user to be signed in."
      };
    }
    const now = new Date();
    // 投稿降順にするための処理
    const key = KeyCreater.create(currentUser.uid);
    try {
      yield database
        .ref(
          `/uploadedImage/${profile.key}/commenteds/${key}/${currentUser.uid}`
        )
        .set(
          {
            comment: profile.comment,
            date: now
          },
          error => {
            console.error(error);
            if (error) {
              console.error(error);
            } else {
            }
          }
        );
      yield database
        .ref(
          `/users/${profile.uid}/uploadImage/${profile.key}/commenteds/${key}/${
            currentUser.uid
          }`
        )
        .set(
          {
            comment: profile.comment,
            date: now
          },
          error => {
            console.error(error);
            if (error) {
              console.error(error);
            } else {
            }
          }
        );
    } catch (err) {
      yield put(
        uploadActions.uploadImage.failed({ params: action.payload, error: err })
      );
      const appError = AppErrorUtil.toAppError(err, {
        name: "uploadImage",
        stack: JSON.stringify(err),
        severity: isIAuthError(err) ? Severity.WARNING : Severity.FATAL
      });
      yield put(appActions.pushErrors([appError]));
    } finally {
      console.log("uploadSaga: uploadImage end.");
    }
  }
};
export default uploadSaga;
