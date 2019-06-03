export default class KeyCreater {
  static create(uid: string) {
    return `${9007199254740991 - new Date().getTime()}${uid}`;
  }
}
