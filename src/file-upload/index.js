import { S3 } from 'aws-sdk';

type UploadConfig = {
  s3: {
    accessKeyId: string,
    secretAccessKey: string,
    region: string
  },
  bucket: string,
  urlExpiration?: number
};

type UploadData = {
  file: Buffer,
  key: string,
  success?: Function,
  error?: Function
};

export default class FileUpload {
  constructor(config: UploadConfig) {
    this.config = config;
    this.checkConfig();
    this.s3 = new S3(config.s3);
  }

  checkConfig() {
    if (!this.config) throw new Error('Configuration object not supplied');
    if (!this.config.s3)
      throw new Error('Configuration object needs s3 params');
    if (!this.config.bucket)
      throw new Error('Configuration requires bucket property');
  }

  upload(data: UploadData) {
    // Check extensions
    function callback(err, response) {
      if (err && data.error) data.error(err);
      if (response && data.success) {
        const url = this.getUrl(data.key);
        data.success(url);
      }
    }
    return this.s3.putObject(
      {
        Bucket: this.config.bucket,
        Key: data.key,
        Body: data.file
      },
      callback.bind(this)
    );
  }

  getUrl(key: string): string {
    const params = {
      Bucket: this.config.bucket,
      Key: key,
      Expires: this.config.urlExpiration || 120
    };
    return this.s3.getSignedUrl('getObject', params);
  }
}
