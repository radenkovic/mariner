Image resizer allows you to resize all sorts of images really fast, using 
amazing [sharp](https://github.com/lovell/sharp) library. 


# Resizing an image

The `resizeImage` function expects configuration object with image (buffer), width, hegiht and quality (optional).

```
import {ImageResizer} from 'node-mariner'

try {
  const file = fs.readFileSync( ... ) // read to Buffer
  const resizedBuffer = ImageResizer.resizeImage({
    image: file,
    width: 500,
    height: 400,
    quality: 95, // optional (defaults to 90),
    sharpen: { // optional sharpening applied to image
      sigma: 1.0,
      flat: 1.0,
      jagged: 1.0,
    },
    fit: 'inside', // 'inside' | 'outside' | 'cover' (crop)
  })
  // save the resizedBuffer, or upload it
} catch(e) {
  // handle resize error
}
```

## resizeImage Configuration

All keys are mandatory unless stated differently.

| key                | type     | description                                                                                   |
| -------------------|----------|-----------------------------------------------------------------------------------------------|
| width              | `number` | expected maximum image width of resized image                                                           | 
| height             | `number` | expected maximum image height of resized image    |
| image | `Buffer` | actual image Buffer                   |
| quality (optional) | `number` | quality of jpg output, defaults to 90                                                   |


# Reading Exif

Using ImageResizer module, you can also read exif from image files (if available).
Generally `ImageResizer.exif` will return at least width and height. If exif is available, it will be provided too.

```
import {ImageResizer} from 'node-mariner'


try {
  const fileWExif = fs.readFileSync( ... ) // read to Buffer
  const exif = await ImageResizer.exif(fileWExif);
  console.log(exif)
} catch (e) {
  // handle the error
}
```