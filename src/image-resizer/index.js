import sharp from 'sharp';
import exifReader from 'exif-reader';
// @flow

type ResizeOptions = {
  image: Buffer,
  width: number,
  height: number,
  quality?: number
};

export default class ImageResizer {
  static async exif(buffer: Buffer): Object {
    let meta = await sharp(buffer).metadata();
    if (meta.exif) meta = { ...meta, ...exifReader(meta.exif) };
    return meta;
  }

  static async resizeImage({
    image,
    width,
    height,
    quality = 90
  }: ResizeOptions) {
    return sharp(image)
      .rotate(0)
      .resize(width, height)
      .withoutEnlargement()
      .jpeg({ quality })
      .toBuffer();
  }
}
