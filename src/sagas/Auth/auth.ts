// tslint:disable: no-else-after-return
// tslint:disable
/* eslint no-throw-literal: 0 */
/* eslint require-yield: 0 */

import { Action } from "typescript-fsa";
import { eventChannel } from "redux-saga";
import { delay } from "redux-saga/effects";
import { put, call, fork, join, take } from "redux-saga/effects";
import firebase, { authProviders, database, storage } from "../../firebase";
import { appActions, authActions } from "../../actions";
import { SigningInfo } from "../../models/SigningInfo";
import { UserInfo } from "../../models/UserInfo";
import { isIAuthError } from "../../models/AuthError";
import { Severity } from "../../models/Severity";
import { InfoLevel } from "../../models/InfoLevel";
import SessionStorageAccessor from "../../utils/SessionStorageAccessor";
import AppErrorUtil from "../../utils/AppErrorUtil";
import AppInfoUtil from "../../utils/AppInfoUtil";
import {
  AUTH_EMAIL_VERIFICATION_REQUIRED,
  AUTH_SHOW_USER_NOT_FOUND_AT_SEND_PASSWORD_RESET_EMAIL,
  AUTH_RELOAD_TIMEOUT
} from "../../const/const";

const data = (type: any, payload: any) => {
  const _data = {
    type: type,
    payload: payload
  };

  return _data;
};

const authChannel = () => {
  const channel = eventChannel(emit => {
    const unsubscribe = firebase
      .auth()
      .onAuthStateChanged(user => emit({ user }), error => emit({ error }));
    return unsubscribe;
  });
  return channel;
};

const authSaga = {
  signUp: function*(action: Action<SigningInfo>): IterableIterator<any> {
    console.log("authSaga: signUp start.");
    try {
      const signing = action.payload;
      if (!signing) {
        throw {
          code: "no signing information",
          message: `signing information is not set.`
        };
      }

      // Email & Password / Provider
      switch (signing.authProvider) {
        case "Google": // TODO: Facebook/Twitter/GitHub を SignUp 対象とするかどうか
        case "Facebook":
        case "Twitter":
        case "GitHub": {
          console.log(`${signing.authProvider} signUp start`);

          // プロバイダチェック
          const authProvider = authProviders.get(signing.authProvider);
          if (!authProvider) {
            throw {
              code: "not registered provider",
              message: `provider [${signing.authProvider}] is not registered.`
            };
          }

          // リダイレクト前に、これから行う処理が SignUp であることを sessionStorage に持たせておく。
          SessionStorageAccessor.setAuthAction({
            action: "SignUp",
            provider: signing.authProvider
          });

          // 行ってこい(Popup)
          yield firebase.auth().signInWithPopup(authProvider);
          break;
        }
        case "Unknown":
          yield firebase.auth().signInAnonymously();
          // 処理完了
          yield put(
            authActions.signIn.done({ params: action.payload, result: true })
          );
          break;
        case "Password":
        default: {
          console.log(`${signing.authProvider} signUp start`);

          // ユーザ新規作成
          const newUser: firebase.auth.UserCredential = yield firebase
            .auth()
            .createUserWithEmailAndPassword(
              signing.email || "",
              signing.password || ""
            );

          // ユーザ名をセットする
          if (newUser && newUser.user) {
            // ※以下の処理では、onAuthStateChanged イベントは発火されない
            yield newUser.user.updateProfile({
              displayName: signing.userName,
              photoURL: null
            });

            // Firebase 側と同期(更新内容がカレントユーザに反映されるまで多少時間がかかる)
            // 暫く待ってからカレントユーザを再取得し、store(redux) に認証情報を再セット
            const task = yield fork(
              authSaga.syncState,
              authActions.syncState.started(AUTH_RELOAD_TIMEOUT)
            );
            yield join(task);

            if (AUTH_EMAIL_VERIFICATION_REQUIRED) {
              console.log("sent a verification email.");
              yield newUser.user.sendEmailVerification();
            }
          } else {
            // 具体的なパスが見えないが、念のため
            throw {
              code: "user creation failed",
              message: `failed to create a new user.`
            };
          }

          // 処理完了を通知(成功)
          yield put(
            authActions.signUp.done({ params: action.payload, result: true })
          );
        }
      }
    } catch (err) {
      yield put(
        authActions.signUp.failed({ params: action.payload, error: err })
      );
      const appError = AppErrorUtil.toAppError(err, {
        name: "signUp",
        stack: JSON.stringify(err),
        severity: isIAuthError(err) ? Severity.WARNING : Severity.FATAL
      });
      yield put(appActions.pushErrors([appError]));
    } finally {
      console.log("authSaga: signUp end.");
    }
  },

  signIn: function*(action: Action<SigningInfo>): IterableIterator<any> {
    console.log("authSaga: signIn start.");
    try {
      const signing = action.payload;
      if (!signing) {
        throw {
          code: "no signing information",
          message: `signing information is not set.`
        };
      }
      // Email & Password / Provider
      switch (signing.authProvider) {
        case "Google":
        case "Facebook":
        case "Twitter":
        case "GitHub": {
          console.log(`${signing.authProvider} signIn start`);

          // プロバイダチェック
          const authProvider = authProviders.get(signing.authProvider);
          if (!authProvider) {
            throw {
              code: "not registered provider",
              message: `provider [${signing.authProvider}] is not registered.`
            };
          }

          // リダイレクト前に、これから行う処理が SignUp であることを sessionStorage に持たせておく。
          SessionStorageAccessor.setAuthAction({
            action: "SignIn",
            provider: signing.authProvider
          });

          // 行ってこい(Popup)
          yield firebase.auth().signInWithPopup(authProvider);
          // 処理完了
          yield put(
            authActions.signIn.done({ params: action.payload, result: true })
          );
          break;
        }
        case "Unknown":
          yield firebase.auth().signInAnonymously();
          // 処理完了
          yield put(
            authActions.signIn.done({ params: action.payload, result: true })
          );
          break;
        case "Password":
        default: {
          if (signing.email && signing.password) {
            console.log(`${signing.authProvider} signIn start`);

            // サインイン
            yield firebase
              .auth()
              .signInWithEmailAndPassword(signing.email, signing.password);

            // 処理完了
            yield put(
              authActions.signIn.done({ params: action.payload, result: true })
            );
            break;
          }
        }
      }
    } catch (err) {
      yield put(
        authActions.signIn.failed({ params: action.payload, error: err })
      );
      const appError = AppErrorUtil.toAppError(err, {
        name: "signIn",
        stack: JSON.stringify(err),
        severity: isIAuthError(err) ? Severity.WARNING : Severity.FATAL
      });
      yield put(appActions.pushErrors([appError]));
    } finally {
      console.log("authSaga: signIn end.");
    }
  },

  signOut: function*(action: Action<undefined>): IterableIterator<any> {
    console.log("authSaga: signOut start.");
    try {
      // サインアウト
      yield firebase.auth().signOut();

      // 処理完了
      yield put(
        authActions.signOut.done({ params: action.payload, result: true })
      );
    } catch (err) {
      yield put(
        authActions.signOut.failed({ params: action.payload, error: err })
      );
      const appError = AppErrorUtil.toAppError(err, {
        name: "signOut",
        stack: JSON.stringify(err),
        severity: isIAuthError(err) ? Severity.WARNING : Severity.FATAL
      });
      yield put(appActions.pushErrors([appError]));
    } finally {
      console.log("authSaga: signOut end.");
    }
  },

  syncState: function*(
    action: Action<number | undefined>
  ): IterableIterator<any> {
    console.log("authSaga: syncState start.");
    try {
      // timeout 値が指定されていれば、その間待ってから処理実行
      const timeout = action.payload;
      if (timeout) {
        yield call(delay, timeout);
      }

      // カレントユーザを取得して、認証状態として再セット
      const user = firebase.auth().currentUser;
      console.dir(user);
      const userInfo: UserInfo = user
        ? {
            displayName: user.displayName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            photoURL: user.photoURL,
            providerId: user.providerId,
            uid: user.uid,
            providerData: user.providerData,
            emailVerified: user.emailVerified
          }
        : user;
      yield put(authActions.stateChanged(userInfo));

      // 処理完了
      yield put(
        authActions.syncState.done({ params: action.payload, result: true })
      );
    } catch (err) {
      yield put(
        authActions.syncState.failed({ params: action.payload, error: err })
      );
      const appError = AppErrorUtil.toAppError(err, {
        name: "syncState",
        stack: JSON.stringify(err),
        severity: isIAuthError(err) ? Severity.WARNING : Severity.FATAL
      });
      yield put(appActions.pushErrors([appError]));
    } finally {
      console.log("authSaga: syncState end.");
    }
  },

  updateUserInfo: function*(action: Action<any>): IterableIterator<any> {
    console.log("authSaga: updateProfile start.");
    // try {
    let profile = action.payload;
    const currentUser = firebase.auth().currentUser;
    if (!currentUser) {
      console.log(`user not signed in`);
      throw {
        code: "user not signed in",
        message: "this operation requires user to be signed in."
      };
    }
    const profileRef: any = {};
    if (profile.uploadedImage) {
      const ref = storage.ref().child(`photoURL:${currentUser.uid}`);
      yield ref.put(profile.uploadedImage);
      let targetURL;
      yield ref.getDownloadURL().then(url => {
        targetURL = url;
      });
      profileRef["photoURL"] = targetURL;
      profile.photoURL = targetURL;
    } else {
      profile.photoURL = currentUser.photoURL;
    }
    profile["uid"] = currentUser.uid;
    yield database.ref(`/users/${currentUser.uid}`).set(profile, error => {
      if (error) {
        console.error(error);
      } else {
      }
    });
    yield database
      .ref(`/speciesCategory/${profile.petSpecies}/${currentUser.uid}`)
      .set(profile, error => {
        if (error) {
          console.error(error);
        }
      });
    profileRef["displayName"] = profile.userName;

    yield currentUser.updateProfile(profileRef);

    // Firebase 側と同期(更新内容がカレントユーザに反映されるまで多少時間がかかる)
    // 暫く待ってからカレントユーザを再取得し、store(redux) に認証情報を再セット
    const task = yield fork(
      authSaga.syncState,
      authActions.syncState.started(AUTH_RELOAD_TIMEOUT)
    );
    yield join(task);

    // 成功時のメッセージ
    yield put(
      appActions.pushInfos([
        AppInfoUtil.createAppInfo({
          level: InfoLevel.SUCCESS,
          title: "Success",
          message: "Profile changed successfully."
        })
      ])
    );

    // 処理完了
    yield put(
      authActions.updateUserInfo.done({ params: action.payload, result: true })
    );
  },

  sendPasswordResetEmail: function*(
    action: Action<string>
  ): IterableIterator<any> {
    console.log("authSaga: sendPasswordResetEmail start.");
    try {
      const email = action.payload;
      if (!email) {
        throw { code: "email not set", message: "email is empty." };
      }

      console.log(`sendPasswordResetEmail start`);

      // パスワード変更メール送信
      try {
        yield firebase.auth().sendPasswordResetEmail(email);
      } catch (err) {
        if (
          isIAuthError(err) &&
          err.code === "auth/user-not-found" &&
          !AUTH_SHOW_USER_NOT_FOUND_AT_SEND_PASSWORD_RESET_EMAIL
        ) {
          // 握りつぶす
          console.log("crushsing exception");
        } else {
          throw err;
        }
      }

      // 成功時のメッセージ
      yield put(
        appActions.pushInfos([
          AppInfoUtil.createAppInfo({
            level: InfoLevel.INFO,
            title: "Done",
            message: `Sent password reset email to ${email}${
              !AUTH_SHOW_USER_NOT_FOUND_AT_SEND_PASSWORD_RESET_EMAIL
                ? "(if account exists)"
                : ""
            }.`
          })
        ])
      );

      // 処理完了
      yield put(
        authActions.sendPasswordResetEmail.done({
          params: action.payload,
          result: true
        })
      );
    } catch (err) {
      yield put(
        authActions.sendPasswordResetEmail.failed({
          params: action.payload,
          error: err
        })
      );
      const appError = AppErrorUtil.toAppError(err, {
        name: "sendPasswordResetEmail",
        stack: JSON.stringify(err),
        severity: isIAuthError(err) ? Severity.WARNING : Severity.FATAL
      });
      yield put(appActions.pushErrors([appError]));
    } finally {
      console.log("authSaga: sendPasswordResetEmail end.");
    }
  },

  storeUserInfo: function*(action: Action<any>): IterableIterator<any> {
    console.log("authSaga: storeUserInfo start.");
    // try {
    let profile = action.payload;
    const currentUser = firebase.auth().currentUser;
    if (!currentUser) {
      console.log(`user not signed in`);
      throw {
        code: "user not signed in",
        message: "this operation requires user to be signed in."
      };
    }
    // 成功時のメッセージ
    yield put(
      appActions.pushInfos([
        AppInfoUtil.createAppInfo({
          level: InfoLevel.SUCCESS,
          title: "Success",
          message: "Profile changed successfully."
        })
      ])
    );
    yield put(
      authActions.storeUserInfo.done({
        params: {
          additionalUserInfo: profile,
          currentUser
        },
        result: true
      })
    );
  },
  checkUserStateSaga: function* checkUserStateSaga() {
    const channel = yield call(authChannel);
    while (true) {
      const { user, error } = yield take(channel);

      if (user && !error) {
        yield put(data("REDUCER_SET_UID", user.uid));
        yield put(data("REDUCER_GET_PROFILE_REQUEST", null));
      } else {
        yield put(data("REDUCER_SET_UID", null));
      }
    }
  }
};
export default authSaga;
