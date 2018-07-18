export function NoConfigException(msg) {
  this.code = 'no-configuration';
  this.message = msg || 'Mailer requires configuration object';
}

export function SendFailedException(message, options) {
  this.code = 'send-failed';
  this.message = message;
  this.data = options;
  this.error = options.error;
}
