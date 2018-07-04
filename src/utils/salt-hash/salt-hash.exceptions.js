export function WrongPasswordException() {
  this.code = 'wrong-password';
  this.message = 'Passwords do not match';
}
export function NoConfigException() {}
