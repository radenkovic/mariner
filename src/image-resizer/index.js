// @flow
import sharp from 'sharp';
import exifReader from 'exif-reader';

type ResizeOptions = {
  image: Buffer,
  width: number,
  height: number,
  quality?: number,
  fit: 'inside' | 'outside' | 'cover',
  sharpen?: {
    sigma: number,
    flat: number,
    jagged: number
  }
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
    fit,
    sharpen,
    quality = 90
  }: ResizeOptions) {
    const sharpObject = sharp(image)
      .rotate(0)
      .resize({ width, height, withoutEnlargement: true, fit })
      .jpeg({ quality });
    if (sharpen) {
      sharpObject.sharpen(sharpen.sigma, sharpen.flat, sharpen.jagged);
    }
    return sharpObject.toBuffer();
  }
}
