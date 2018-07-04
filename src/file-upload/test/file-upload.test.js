// @flow
import fs from 'fs';
import FileUpload from '../index';

const Uploader = new FileUpload({
  s3: {
    accessKeyId: 'test',
    secretAccessKey: 'test',
    region: 'us-east-1'
  },
  bucket: 'mariner'
});

describe('Upload to S3', () => {
  const file = fs.readFileSync(
    `${process.cwd()}/src/file-upload/test/sample.txt`
  );

  // Mock S3 Uploader
  Uploader.s3.putObject = (params, callback) => {
    if (params.Body) return callback(null, true);
    return callback(true);
  };

  test('Upload success', () => {
    Uploader.upload({
      file,
      key: 'test/sample.txt',
      success: url => expect(url).toBeDefined(),
      error: err => expect(err).toBeUndefined()
    });
  });

  test('Upload failure', () => {
    Uploader.upload({
      key: 'test/sample.txt',
      success: url => expect(url).toBeUndefined(),
      error: err => expect(err).toBeDefined()
    });
  });
});

describe('Configuration object', () => {
  test('No configuration exception', () => {
    expect(() => {
      const ShouldFail = new FileUpload();
      return ShouldFail;
    }).toThrow();
  });
  test('No s3 configuration exception', () => {
    expect(() => {
      const ShouldFail = new FileUpload({});
      return ShouldFail;
    }).toThrow();
  });
  test('No bucket exception', () => {
    expect(() => {
      const ShouldFail = new FileUpload({ s3: {} });
      return ShouldFail;
    }).toThrow();
  });
});
