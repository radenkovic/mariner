import Authenticate from '../index';
import {
  NoAuthorizationFunctionException,
  NotAutorizedException
} from '../authenticate.exceptions';

const expected =
  'eyJhbGciOiJIUzI1NiJ9.c29tZWRhdGE.GWMovQ-8ZRTEKAWTavoWgbFpqndn9dE-s2rHzSuiSW0';

describe('JWT sign and verify', () => {
  test('Expect instantiate without config to throw', () => {
    expect(() => {
      const JWT = new Authenticate();
      return JWT;
    }).toThrow();
  });

  test('Sign/Verify Success', () => {
    const JWT = new Authenticate({ secret: 'foo' });
    const encoded = JWT.sign('somedata');
    expect(encoded).toBe(expected);
    expect(JWT.verify(expected)).toBe('somedata');
  });

  test('Verify Exception', () => {
    const JWT = new Authenticate({ secret: 'foo' });
    expect(() => JWT.verify('notarealone')).toThrow();
  });
});

describe('Authorize', () => {
  test('Authorize no authorizationFn', async () => {
    const JWT = new Authenticate({ secret: 'foo' });
    try {
      await JWT.authenticate({ name: 'dan' });
    } catch (e) {
      expect(e instanceof NoAuthorizationFunctionException).toBe(true);
    }
  });
  test('Authorize success', async () => {
    const authorizationFn = data => data;
    const JWT = new Authenticate({ secret: 'foo', authorizationFn });
    const res = await JWT.authenticate({ name: 'dan' });
    expect(res).toHaveProperty('access_token');
    expect(res).toHaveProperty('name', 'dan');
  });
  test('Authorize failure', async () => {
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    const authorizationFn = async () => {
      await sleep(10);
      throw new Error();
    };
    const JWT = new Authenticate({ secret: 'foo', authorizationFn });
    try {
      await JWT.authenticate({ name: 'dan' });
    } catch (e) {
      expect(e instanceof NotAutorizedException).toBe(true);
    }
  });
});
