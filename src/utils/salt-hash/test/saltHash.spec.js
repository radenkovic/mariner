import saltHashPassword, {
  genRandomString,
  sha512,
  verifyPassword
} from '../index';

test('Expect random string of proposed length', () => {
  const check = genRandomString(5);
  expect(check).toHaveLength(5);
});

test('Expect sha512 hash', () => {
  const check = sha512('pass', 'salt');
  expect(check).toBeDefined();
});

test('Expect salted hash of password', () => {
  const check = saltHashPassword('pass');
  expect(check.salt).toBeDefined();
  expect(check.hash).toBeDefined();
});

test('Verify password failure', () => {
  expect(() =>
    verifyPassword({
      enteredPassword: 'test',
      salt: 'abc',
      password: 'X'
    })
  ).toThrow();
});

test('Verify password success', () => {
  expect(
    verifyPassword({
      enteredPassword: 'pass',
      salt: '3637696935799406',
      password:
        'e4454f23e6311a00198eca18ef2c87230bd70ad4e6709184f9af158b5a9c92fcb53c48aab406203df62f2fb95698f085a82d7be66ad77a84a30b26e7bd76fe62'
    })
  ).toBeUndefined();
});
