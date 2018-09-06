import bcrypt from 'bcrypt';

function PasswordNotValidException() {
  this.message = 'Password is not valid';
  this.code = 'not-valid';
}

export const verifyPassword = async ({ enteredPassword, password }) => {
  const valid = await bcrypt.compare(enteredPassword, password);
  if (!valid) {
    throw new PasswordNotValidException();
  }
  return valid;
};

export const SaltHashSync = (password: string, saltStrength: number = 9) =>
  bcrypt.hashSync(password, saltStrength);

export default async (password: string, saltStrength: number = 9) =>
  bcrypt.hash(password, saltStrength);
