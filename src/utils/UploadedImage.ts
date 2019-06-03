import { database } from "../firebase";

export default class UploadedImage {
  static getMyUploadedImageRef(userId: string) {
    return database
      .ref(`/uploadedImage`)
      .orderByChild("uid")
      .startAt(userId)
      .endAt(userId);
  }

  static getMyUploadedImageDetailRef(userId: string, key: string) {
    return database.ref(`/users/${userId}/uploadImage/${key}`);
  }

  static getFullUploadedImageRef() {
    return database.ref(`/uploadedImage`);
  }

  static getUploadedImageBySpeciesRef(speciesId: string) {
    return database.ref(`/uploadedImage/${speciesId}`);
  }

  static getUploadedImageRef(speciesId: string, key: string, uid: string) {
    return database.ref(`/uploadedImage/${speciesId}/${key}/${uid}`);
  }

  static getUploadedImageCommentedsRef(key: string) {
    return database.ref(`/uploadedImage/${key}/commenteds`);
  }
}
