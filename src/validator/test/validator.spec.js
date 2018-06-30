import { Validator, Sanitizer } from '../index';

describe('Sanitizer', () => {
  test('Sanitize without whitelist returns data', () => {
    expect(Sanitizer({ id: 5, test: true })).toEqual({ id: 5, test: true });
  });
  test('Sanitize with whitelist', () => {
    expect(Sanitizer({ id: 5, test: true }, ['id'])).toEqual({ id: 5 });
  });
  test('Sanitize with whitelist passThru', () => {
    expect(Sanitizer({ id: 5, $test: true }, ['id'], ['$test'])).toEqual({
      id: 5,
      $test: true
    });
  });
});

describe('Validator', () => {
  test('Validate success', () => {
    expect(Validator({ test: true }, { test: { presence: true } })).toEqual(
      undefined
    );
  });
  test('Validate error', () => {
    expect(Validator({ test: 'yeah' }, { name: { presence: true } })).toEqual({
      name: ["Name can't be blank"]
    });
  });
  test('Validate date success', () => {
    expect(
      Validator(
        { date: new Date().toISOString() },
        { date: { datetime: true } }
      )
    ).toBe(undefined);
  });
  // test('Validate date failure', () => {
  //   expect(Validator({ date: 'nodate' }, { date: { datetime: true } })).toEqual(
  //     {
  //       date: ['Date must be a valid date']
  //     }
  //   );
  // });
});
