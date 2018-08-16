// import 'babel-polyfill';

import Model from './model';
import Service from './service';
import Authenticate from './authenticate';
import Events from './events';
import FileUploadS3 from './file-upload-s3';
import Mailer from './mailer';
import ImageResizer from './image-resizer';
import SaltHash, { verifyPassword } from './utils/salt-hash';
import Validator, { Sanitizer } from './utils/validator';

export {
  Model,
  Service,
  Authenticate,
  Events,
  FileUploadS3,
  Mailer,
  SaltHash,
  verifyPassword,
  Validator,
  Sanitizer,
  ImageResizer
};
