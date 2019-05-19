import { database } from "../firebase";

export default class User {
  static isInitAuthedRef(userId: string) {
    return database.ref(`users/${userId}`);
  }
}
