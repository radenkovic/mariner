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
    `${process.cwd()}/src/file-upload-s3/test/sample.txt`
  );

  test.skip('Upload success', async () => {
    try {
      await Uploader.upload({ file, key: 'test/sample.txt' });
    } catch (e) {
      console.log(e);
      expect(e).toBeUndefined();
    }
  });

  test('Upload failure', async () => {
    try {
      await Uploader.upload({ key: 'test/sample.txt' });
    } catch (e) {
      expect(e).toBeDefined();
    }
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
