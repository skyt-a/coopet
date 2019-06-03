export class UploadFile {
  static uploadImage(
    e: any,
    handleFile: (src: any, blob: any) => void,
    handleError: () => void
  ) {
    const createObjectURL =
      (window.URL || (window as any).webkitURL).createObjectURL ||
      (window as any).createObjectURL;
    const files = e.target.files;
    const file = files[0];
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      handleError && handleError();
      return;
    }
    const image = new Image();
    const reader = new FileReader();
    let blob;
    const THUMBNAIL_WIDTH = 500; // 画像リサイズ後の横の長さの最大値
    const THUMBNAIL_HEIGHT = 500; // 画像リサイズ後の縦の長さの最大値
    reader.onload = (event: any) => {
      image.onload = () => {
        let width, height;
        if (image.width > image.height) {
          // 横長の画像は横のサイズを指定値にあわせる
          let ratio = image.height / image.width;
          width = THUMBNAIL_WIDTH;
          height = THUMBNAIL_WIDTH * ratio;
        } else {
          // 縦長の画像は縦のサイズを指定値にあわせる
          let ratio = image.width / image.height;
          width = THUMBNAIL_HEIGHT * ratio;
          height = THUMBNAIL_HEIGHT;
        }
        // サムネ描画用canvasのサイズを上で算出した値に変更
        const canvas: any = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        // canvasに既に描画されている画像をクリア
        ctx.clearRect(0, 0, width, height);
        // canvasにサムネイルを描画
        ctx.drawImage(
          image,
          0,
          0,
          image.width,
          image.height,
          0,
          0,
          width,
          height
        );

        // canvasからbase64画像データを取得
        const base64 = canvas.toDataURL("image/jpeg");
        // base64からBlobデータを作成
        const bin = atob(base64.split("base64,")[1]);
        const len = bin.length;
        const barr = new Uint8Array(len);
        let i = 0;
        while (i < len) {
          barr[i] = bin.charCodeAt(i);
          i++;
        }
        blob = new Blob([barr], { type: "image/jpeg" });
        // blobデータからurlを生成
        let src = createObjectURL(blob);
        if (blob) {
          handleFile && handleFile(src, blob);
        }
      };
      image.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
}
