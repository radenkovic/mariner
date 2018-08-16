import bcrypt from 'bcrypt';

export const verifyPassword = async ({ enteredPassword, password }) =>
  bcrypt.compare(enteredPassword, password);

export default async (password: string, saltStrength: number = 9) =>
  bcrypt.hash(password, saltStrength);
