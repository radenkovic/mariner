import Service from '../index';
import {
  MethodNotAllowedException,
  UpdateWithoutIdException,
  UpsertWithoutWhereException
} from '../service.exceptions';

const mockModel = {
  idField: 'id',
  find: data => ({ mode: 'find', ...data }),
  findOne: data => ({ mode: 'findOne', ...data }),
  create: data => ({ mode: 'create', ...data }),
  delete: id => (id < 1000 ? 1 : 0),
  update: (id, data) => ({ mode: 'update', id, ...data }),
  upsert: (where, data) => ({ mode: 'upsert', where, ...data })
};

const TestService = new Service({
  name: 'TestService',
  model: mockModel
});

describe('Service default methods', () => {
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
      await TestService.service('update', { id: 1, name: 'tester' })
    ).toEqual({
      mode: 'update',
      id: 1,
      name: 'tester'
    });
  });

  test('update without id exception', async () => {
    try {
      await TestService.service('update', { name: 'tester' });
    } catch (e) {
      expect(e instanceof UpdateWithoutIdException).toBe(true);
    }
  });

  test('upsert', async () => {
    expect(
      await TestService.service('upsert', {
        id: 1,
        name: 'tester',
        $where: { id: 1 }
      })
    ).toEqual({
      mode: 'upsert',
      where: { id: 1 },
      name: 'tester'
    });
  });

  test('upsert without where exception', async () => {
    try {
      await TestService.service('upsert', { name: 'tester' });
    } catch (e) {
      expect(e instanceof UpsertWithoutWhereException).toBe(true);
    }
  });

  test('delete', async () => {
    expect(await TestService.service('delete', 55)).toBe(1);
  });
});

describe('Service behavior and exceptions', () => {
  test('Throw error on non-existing method', async () => {
    try {
      await TestService.service('methodNotExist', { id: 1 });
    } catch (e) {
      expect(e instanceof MethodNotAllowedException).toBe(true);
    }
  });

  test('Service returns params without model', async () => {
    const ServiceTwo = new Service({});
    const res = await ServiceTwo.service('find', { id: 1 });
    expect(res).toEqual({ id: 1 });
  });
});

describe('Service sanitize and validate', () => {
  test('Sanitize, sanitize', async () => {
    TestService.sanitize.find = ['id', 'name'];
    const res = await TestService.service('find', { id: 1, edit: 'false' });
    expect(res).toEqual({ mode: 'find', id: 1 });
  });

  test('Validate failure', async () => {
    TestService.sanitize = {};
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
    TestService.sanitize = {};
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

  test('Custom validator', async () => {
    const CustomValService = new Service({
      name: 'CustomValService',
      validator: () => undefined
    });
    const res = await CustomValService.service('find', { id: 1 });
    expect(res).toEqual({ id: 1 });
  });

  test('Custom sanitizer', async () => {
    const CustomValService = new Service({
      name: 'CustomValService',
      sanitizer: () => ({ sanitized: true })
    });
    CustomValService.sanitize = {
      find: ['name']
    };
    const res = await CustomValService.service('find', { id: 1 });
    expect(res).toEqual({ sanitized: true });
  });

  test('Custom service', async () => {
    const CustomService = new Service({ name: 'CustomService' });
    CustomService.customMethod = data => data;
    const res = await CustomService.service('customMethod', { id: 1 });
    expect(res).toEqual({ id: 1 });
  });

  test('No Configuration exception', () => {
    expect(() => {
      const Dummy = new Service();
      return Dummy;
    }).toThrow();
  });
});