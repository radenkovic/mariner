import Events from '../index';

test('Instantiate', () => {
  const Q = new Events();
  expect(Q).toBeDefined();
});

test('Register Event', () => {
  const Q = new Events();
  Q.on('test', () => 'ok');
  expect(Q).toBeDefined();
  expect(Q.count('test')).toBe(1);
});

test('Register Listener', () => {
  const Q = new Events();
  Q.on('test', e => {
    expect(e).toBeDefined();
  });
  Q.emit('test', { test: true });
});

test('Deregister', () => {
  const Q = new Events();
  const fn = e => e;
  Q.on('test', fn);
  Q.off('test', fn);
  expect(Q.count('test')).toBe(0);
});
