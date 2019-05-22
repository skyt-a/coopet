import { database } from "../firebase";

export default class UploadedImage {
  static getMyUploadedImageRef(userId: string) {
    return database.ref(`/users/${userId}/uploadImage`);
  }

  static getUploadedImageBySpeciesRef(speciesId: string) {
    return database.ref(`/uploadedImage/${speciesId}`);
  }
}
