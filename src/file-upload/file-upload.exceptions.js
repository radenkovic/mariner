export function NoConfigException(message) {
  this.code = 'no-configuration';
  this.message = message;
}

export function NoFileException() {}
