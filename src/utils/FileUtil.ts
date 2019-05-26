export default class FileUtil {
  //   resizeImage(base64image, callback) {
  //     const MIN_SIZE = 1000;
  //     var canvas = document.createElement("canvas");
  //     var ctx = canvas.getContext("2d");
  //     var image = new Image();
  //     image.crossOrigin = "Anonymous";
  //     image.onload = function(event) {
  //       var dstWidth, dstHeight;
  //       if (this.width > this.height) {
  //         dstWidth = MIN_SIZE;
  //         dstHeight = (this.height * MIN_SIZE) / this.width;
  //       } else {
  //         dstHeight = MIN_SIZE;
  //         dstWidth = (this.width * MIN_SIZE) / this.height;
  //       }
  //       canvas.width = dstWidth;
  //       canvas.height = dstHeight;
  //       ctx.drawImage(
  //         this,
  //         0,
  //         0,
  //         this.width,
  //         this.height,
  //         0,
  //         0,
  //         dstWidth,
  //         dstHeight
  //       );
  //       callback(canvas.toDataURL());
  //     };
  //     image.src = base64image;
  //   }
}
