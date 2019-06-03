import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

import { AuthProvider } from "./models/AuthProvider";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: "coopet-51a0b.firebaseapp.com",
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_ID
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const authProviders = new Map<AuthProvider, firebase.auth.AuthProvider>([
  ["Password", new firebase.auth.EmailAuthProvider()],
  ["Google", new firebase.auth.GoogleAuthProvider()],
  ["GitHub", new firebase.auth.GithubAuthProvider()],
  ["Facebook", new firebase.auth.FacebookAuthProvider()],
  ["Twitter", new firebase.auth.TwitterAuthProvider()]
]);
export const emailAuthProvider = firebase.auth.EmailAuthProvider; //
export const database = firebase.database();
export const storage = firebase.storage();
export default firebase;
