export default class KeyCreater {
  static create() {
    return 9007199254740991 - new Date().getTime();
  }
}
