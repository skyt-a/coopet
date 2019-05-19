import { database } from "../firebase";

export default class Follow {
  static getFollowingRef(userId: string) {
    return database.ref(`following/${userId}`);
  }

  static getFollowerRef(userId: string) {
    return database.ref(`follower/${userId}`);
  }
}
