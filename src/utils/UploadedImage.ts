import { database } from "../firebase";

export default class UploadedImage {
  static getMyUploadedImageRef(userId: string) {
    return database.ref(`/users/${userId}/uploadImage`);
  }

  static getUploadedImageBySpeciesRef(speciesId: string) {
    return database.ref(`/uploadedImage/${speciesId}`);
  }

  static getUploadedImageRef(speciesId: string, key: string, uid: string) {
    return database.ref(`/uploadedImage/${speciesId}/${key}/${uid}`);
  }

  static getUploadedImageCommentedsRef(
    speciesId: string,
    key: string,
    uid: string
  ) {
    return database.ref(`/uploadedImage/${speciesId}/${key}/${uid}/commenteds`);
  }
}
