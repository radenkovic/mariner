import saltHashPassword, { verifyPassword, SaltHashSync } from '../index';

test('hash password', async () => {
  const hash = await saltHashPassword('sampleP2121321312ass');
  expect(hash).toBeDefined();
});

test('hash password with strength', async () => {
  const hash = await saltHashPassword('sampleP2121321312ass', 2);
  expect(hash).toBeDefined();
});

test('hash password sync', () => {
  const hash = SaltHashSync('sampleP2121321312ass');
  expect(hash).toBeDefined();
});

test('hash password sync with strength', () => {
  const hash = SaltHashSync('sampleP2121321312ass', 2);
  expect(hash).toBeDefined();
});

test('verify password success', async () => {
  try {
    const hash = await verifyPassword({
      enteredPassword: 'samplePass',
      password: '$2b$08$JVXhc5HaLQW7TH3.oERbqOKASE.4OB927sHzLXwkA9.kXIybFGIAe'
    });
    expect(hash).toBe(true);
  } catch (e) {
    expect(e).toBeUndefined();
  }
});

test('verify password failure', async () => {
  try {
    const hash = await verifyPassword({
      enteredPassword: 'samplePass_FAIL',
      password: '$2b$08$JVXhc5HaLQW7TH3.oERbqOKASE.4OB927sHzLXwkA9.kXIybFGIAe'
    });
    expect(hash).toBe(false);
  } catch (e) {
    expect(e).toBeDefined();
  }
});
