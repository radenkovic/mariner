# File Upload S3

Module is configuration only and simplifies uploads to [AWS S3](https://aws.amazon.com/s3/)
 cloud storage. 
It also provides methods for creating signed, expiring urls.

## Instantiating FileUpload Object

To instantiate the module and prepare it for use, just provide configuration
object as following:

```
import { FileUploadS3 } from 'node-mariner'

const Uploader new = FileUploadS3({
  s3: {
    accessKeyId: '<YOUR_ACCESS_KEY_ID>',
    secretAccessKey: '<YOUR_SECRET_ACCESS_KEY>',
    region: 'us-east-1'
  },
  bucket: 'mariner',
  urlExpiration: 60
})
```

All `FileUploadS3` configuration properties are mandatory unless stated differently.

| key           | type          | description  |
| ------------- |-------------| -----|
| s3            | `object`      | Configuration obtained from AWS S3, keys are `accessKeyId`, 'secretAccessKey', `region` |
| bucket        | `string`      |   S3 bucket name |
| urlExpiration (optional) | `integer`, defaults to 120    |    Expiration time in seconds if you are using signed links |

***Caution***: do not store s3 keys in the repository, use [dotenv](https://github.com/motdotla/dotenv)
or environment variables.


## Uploading files

To upload a file, you use instantiated `FileUploaderS3`, provide a `<Buffer>`,
path (key) and optional callbacks for upload success and upload error.

```
const sampleBuffer = new Buffer(512); // ... buffer obtained from upload, etc...

Uploader.upload({
  file: sampleBuffer,
  key: 'some/path/sampleBuffer.txt', 
  success: url => console.log(url),
  error: err => console.log(err) 
});

```

`Uploader.upload` configuration object:
`

| key           | type          | description                                   |
| ------------- |-------------| ---------------------------------------------|
| file          | `Buffer`      | Configuration obtained from AWS S3, keys are `accessKeyId`, 'secretAccessKey', `region` |
| key           | `string`      |   path (key), and filename with extension |
| success (optional) | `function` |    Callback function on file upload success, first argument is file upload url |
| error (optional)   | `function` |    Callback function on file upload error, first argument is error object |


## Uploading files to different buckets

To upload files to different buckets, instantiate two objects with separate 
configuration and use those accordingly:

```
const s3 = { ... }
export const BucketA = new FileUploadS3({ s3, bucket: 'bucketA' })
export const BucketB = new FileUploadS3({ s3, bucket: 'bucketB' })
```

## Creating signed links

AWS S3 can provide signed links, that have expiry date. If you prefer signed
links, you should set your bucket to `private`. Rest is easy as:

```
const signedUrl = BucketA.getUrl('some/key.txt')
console.log(signedUrl) // returns signed url for file key.txt in bucketA
```

Please note that function is synchronous and requires one argument (`key`).
If you want to set up custom expiry, you can set `urlExpiration` in FileUploadS3
configuration object. Default urlExpiration is set to 120 seconds.




