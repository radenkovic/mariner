export function NoConfigException(message: string) {
  this.code = 'no-configuration';
  this.message = message;
}

export function InvalidParamException(param: string) {
  this.code = 'invalid-param';
  this.param = param;
  this.message = `Param ${param} is not supported by Model.find`;
}
