import Service from '../index';

const mockModel = {
  idField: 'id',
  find: data => ({ mode: 'find', ...data }),
  findOne: data => ({ mode: 'findOne', ...data }),
  create: data => ({ mode: 'create', ...data }),
  upsert: (where, data) => ({ mode: 'upsert', where, ...data }),
  delete: id => id,
  update: (id, data) => ({ mode: 'update', id, ...data })
};

const TestService = new Service({
  model: mockModel
});

describe('Service methods', () => {
  test('find', async () => {
    expect(await TestService.service('find', { id: 1 })).toEqual({
      mode: 'find',
      id: 1
    });
  });

  test('findOne', async () => {
    expect(await TestService.service('findOne', { id: 1 })).toEqual({
      mode: 'findOne',
      id: 1
    });
  });

  test('create', async () => {
    expect(await TestService.service('create', { id: 1 })).toEqual({
      mode: 'create',
      id: 1
    });
  });

  test('update', async () => {
    expect(
      await TestService.service('update', { id: 55, name: 'tester' })
    ).toEqual({ mode: 'update', id: 55, name: 'tester' });
  });

  test('delete', async () => {
    expect(await TestService.service('delete', 55)).toBe(55);
  });
});

describe('Service Hooks', () => {
  test('Before all', async () => {
    TestService.hooks = {
      before: {
        all: [
          params => {
            params.test = true;
          }
        ]
      },
      after: {}
    };
    const res = await TestService.service('find', { id: 22 });
    expect(res).toEqual({ mode: 'find', id: 22, test: true });
  });

  test('Before get', async () => {
    TestService.hooks = {
      before: {
        find: [
          params => {
            params.test = true;
          },
          params => {
            params.done = true;
          }
        ]
      },
      after: {}
    };
    const res = await TestService.service('find', { id: 22 });
    expect(res).toEqual({ mode: 'find', id: 22, test: true, done: true });
  });

  test('After all', async () => {
    TestService.hooks = {
      after: {
        all: [
          params => {
            params.test = true;
          }
        ]
      },
      before: {}
    };
    const res = await TestService.service('find', { id: 22 });
    expect(res).toEqual({ mode: 'find', id: 22, test: true });
  });

  test('After find', async () => {
    TestService.hooks = {
      after: {
        find: [
          params => {
            params.test = true;
          },
          params => {
            params.done = true;
          }
        ]
      },
      before: {}
    };
    const res = await TestService.service('find', { id: 22 });
    expect(res).toEqual({ mode: 'find', id: 22, test: true, done: true });
  });

  test('Stop propagation on error', async () => {
    TestService.hooks = {
      before: {
        find: [
          params => {
            params.test = true;
            const obj = { someError: true };
            throw obj;
          }
        ]
      },
      after: {}
    };
    try {
      await TestService.service('find', { id: 1 });
    } catch (e) {
      expect(e).toEqual({ someError: true });
    }
  });

  test('Stop propagation on return false', async () => {
    TestService.hooks = {
      before: {
        find: [
          params => {
            params.test = true;
            return false;
          },
          params => {
            params.secondModifier = true;
          }
        ]
      },
      after: {}
    };
    expect(await TestService.service('find', { id: 1 })).toEqual({
      id: 1,
      mode: 'find',
      test: true
    });
  });

  test('Throw error on non-existing method', async () => {
    TestService.hooks = { before: {}, after: {} };
    try {
      await TestService.service('methodNotExist', { id: 1 });
    } catch (e) {
      expect(e).toEqual(e);
    }
  });

  test('Without model', async () => {
    const ServiceTwo = new Service({});
    const res = await ServiceTwo.service('find', { id: 1 });
    expect(res).toEqual({ id: 1 });
  });
});

describe('Service sanitize and validate', () => {
  test('Sanitize, allowedParams', async () => {
    TestService.allowedParams = ['id', 'name'];
    const res = await TestService.service('find', { id: 1, edit: 'false' });
    expect(res).toEqual({ mode: 'find', id: 1 });
  });

  test('Validate failure', async () => {
    TestService.allowedParams = [];
    TestService.validate = {
      find: {
        name: { presence: true }
      }
    };
    try {
      await TestService.service('find', { id: 1, edit: 'false' });
    } catch (e) {
      expect(e).toEqual({ name: ["Name can't be blank"] });
    }
  });

  test('Validate success', async () => {
    TestService.allowedParams = [];
    TestService.validate = {
      find: {
        name: { presence: true }
      }
    };
    try {
      await TestService.service('find', { id: 1, name: 'false' });
    } catch (e) {
      expect(e).toEqual({ name: ["Name can't be blank"] });
    }
  });
});
