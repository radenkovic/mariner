export function NoConfigException() {
  this.code = 'no-configuration';
  this.message = 'Authenticate expects configuration object';
}

export function NoAuthorizationFunctionException(payload) {
  this.code = 'no-auth-fn';
  this.message = 'No authorizationFn provided in configuration object';
  this.data = payload;
}

export function NotAutorizedException(payload) {
  this.code = 'not-authorized';
  this.message = 'Authorization failed';
  this.data = payload;
}
