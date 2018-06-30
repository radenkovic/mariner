export function AuthenticateNoConfigException() {
  this.message = 'Authenticate expects configuration object';
}

export function NoAuthorizationFunctionException(payload) {
  this.message = 'No authorizationFn provided in configuration object';
  this.data = payload;
}
export function NotAutorizedException(payload) {
  this.message = 'Authorization failed';
  this.data = payload;
}
