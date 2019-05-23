import { database } from "../firebase";

export default class User {
  static isInitAuthedRef(userId: string) {
    return database.ref(`users/${userId}`);
  }

  static getUsersBySpeciesRef(speciesId: string) {
    return database.ref(`/speciesCategory/${speciesId}`);
  }
}
