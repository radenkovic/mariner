import fs from 'fs';
import ImageResizer from '../index';

const image = fs.readFileSync(`${__dirname}/sample.jpg`);
const text = fs.readFileSync(`${__dirname}/text.txt`);
const wExif = fs.readFileSync(`${__dirname}/iphone.jpg`);

test('it should resize image', async () => {
  try {
    const resized = await ImageResizer.resizeImage({
      image,
      width: 320,
      height: 240,
      sharpen: {
        sigma: 1,
        jagged: 1,
        flat: 1
      }
    });
    expect(resized).toBeDefined();
  } catch (e) {
    expect(e).toBeUndefined();
  }
});

test('it should fail on text file', async () => {
  try {
    await ImageResizer.resizeImage({
      image: text,
      width: 320,
      height: 240
    });
  } catch (e) {
    expect(e).toBeDefined();
  }
});

test('it should read meta', async () => {
  try {
    const exif = await ImageResizer.exif(image);
    expect(exif).toHaveProperty('width');
    expect(exif).toHaveProperty('height');
  } catch (e) {
    expect(e).toBeUndefined();
  }
});

test('it should read exif', async () => {
  try {
    const exif = await ImageResizer.exif(wExif);
    expect(exif).toHaveProperty('width');
    expect(exif).toHaveProperty('height');
    expect(exif).toHaveProperty('exif');
  } catch (e) {
    expect(e).toBeUndefined();
  }
});

test('it should fail on text input', async () => {
  try {
    await ImageResizer.exif(text);
  } catch (e) {
    expect(e).toBeDefined();
  }
});
