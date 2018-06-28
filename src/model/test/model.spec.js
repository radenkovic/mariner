import Model from '../index';
import config from '../../../knexfile';

const UserModel = new Model({
  table: 'user_test',
  config
});

beforeAll(async () => {
  await UserModel.db.schema.createTable('user_test', table => {
    table.increments();
    table.string('username');
    table.string('first_name');
    table.string('email');
    table.timestamps();
  });
  await UserModel.create({
    username: 'dan',
    first_name: 'Dan',
    email: 'dan@radenkovic.org'
  });
  await UserModel.create({
    username: 'dan2',
    first_name: 'Dan2',
    email: 'dan2@radenkovic.org'
  });
  await UserModel.create({
    username: 'dan3',
    first_name: 'Dan3',
    email: 'dan3@radenkovic.org'
  });
});

afterAll(async () => {
  await UserModel.db.schema.dropTable('user_test');
  await UserModel.db.destroy();
});

describe('Model Basics', () => {
  test('Expect Model to be defined', async () => {
    expect(UserModel).toBeDefined();
  });

  test('Expect Model to fail without table name', async () => {
    expect(() => new Model({ config })).toThrow();
  });

  test('Expect Model to fail without knex config', async () => {
    expect(() => new Model({ table: 'notable' })).toThrow();
  });
});

describe('Model Find', () => {
  test('Find all', async () => {
    const res = await UserModel.find();
    expect(res).toBeDefined();
  });

  test('Find by ID', async () => {
    const id = 1;
    const res = await UserModel.find({ id });
    expect(res).toHaveLength(1);
    expect(res[0].id).toBe(id);
  });

  test('Find by email', async () => {
    const email = 'dan@radenkovic.org';
    const res = await UserModel.find({ email });
    expect(res).toHaveLength(1);
    expect(res[0].email).toBe(email);
  });

  test('Find $in', async () => {
    const id = { $in: [1, 2] };
    const res = await UserModel.find({ id });
    expect(res).toHaveLength(2);
  });

  test('Find $nin', async () => {
    const id = { $nin: [1, 2, 3] };
    const res = await UserModel.find({ id });
    expect(res).toHaveLength(0);
  });

  test('Find $lt', async () => {
    const id = { $lt: 2 };
    const res = await UserModel.find({ id });
    expect(res).toHaveLength(1);
  });

  test('Find $lte', async () => {
    const id = { $lte: 2 };
    const res = await UserModel.find({ id });
    expect(res).toHaveLength(2);
  });

  test('Find $gt', async () => {
    const id = { $gt: 2 };
    const res = await UserModel.find({ id });
    expect(res).toHaveLength(1);
  });

  test('Find $gte', async () => {
    const id = { $gte: 2 };
    const res = await UserModel.find({ id });
    expect(res).toHaveLength(2);
  });

  test('Find $between', async () => {
    const id = { $between: [1, 3] };
    const res = await UserModel.find({ id });
    expect(res).toHaveLength(3);
  });

  test('Find $notBetween', async () => {
    const id = { $notBetween: [1, 2] };
    const res = await UserModel.find({ id });
    expect(res).toHaveLength(1);
  });

  test('Find $null: true', async () => {
    const id = { $null: true };
    const res = await UserModel.find({ id });
    expect(res).toHaveLength(0);
  });

  test('Find $null: false', async () => {
    const id = { $null: false };
    const res = await UserModel.find({ id });
    expect(res).toHaveLength(3);
  });

  test('Find $or', async () => {
    const $or = { id: 1, email: 'dan@radenkovic.org' };
    const res = await UserModel.find({ $or });
    expect(res).toHaveLength(1);
  });

  test('Find $sort', async () => {
    const $sort = { field: 'id' };
    const res = await UserModel.find({ $sort });
    expect(res[0].id).toBe(3);
  });

  // Pagination
  test('Find pagination: $skip', async () => {
    const $skip = 1;
    const res = await UserModel.find({ $skip });
    expect(res).toHaveLength(2);
  });

  test('Find pagination: $limit', async () => {
    const $limit = 2;
    const res = await UserModel.find({ $limit });
    expect(res).toHaveLength(2);
  });

  test('Find with fake parameter throws error', () => {
    expect(() => UserModel.find({ id: { yes: true } })).toThrow();
  });

  test('Find with nonexistent field throws error', async () => {
    try {
      await UserModel.find({ fakeField: 'test' });
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
});

describe('Model findOne', () => {
  test('findOne by ID', async () => {
    const res = await UserModel.findOne({ id: 2 });
    expect(res.id).toBe(2);
  });
  test('findOne without params', async () => {
    const res = await UserModel.findOne();
    expect(res).toBeDefined();
  });
});

describe('Model update', () => {
  test('Update name', async () => {
    const res = await UserModel.update(1, { id: 1111, first_name: 'Dan' });
    expect(res.first_name).toBe('Dan');
  });
  test('Update without data', async () => {
    const res = await UserModel.update(10000, { username: 'test' });
    expect(res).toBe(null);
  });
});

describe('Model upsert', () => {
  test('Upsert existing', async () => {
    const res = await UserModel.upsert(
      { email: 'dan@radenkovic.org' },
      { first_name: 'Dan' }
    );
    expect(res.email).toBe('dan@radenkovic.org');
  });
  test('Upsert new entry', async () => {
    const res = await UserModel.upsert(
      { email: 'dan222@radenkovic.org' },
      { first_name: 'Dan5' }
    );
    expect(res.first_name).toBe('Dan5');
  });
});

describe('Model Sanitize', () => {
  test('Sanitize username', async () => {
    UserModel.sanitize = {
      username: x => x.toLowerCase().trim()
    };
    const res = await UserModel.update(1, { username: ' DAN ' });
    expect(res.username).toBe('dan');
  });
});

describe('Model Create', () => {
  test('Create with data', async () => {
    const res = await UserModel.create({
      username: 'newuser',
      email: 'newuser@gmail.com'
    });
    expect(res.username).toBe('newuser');
  });
});

describe('Model Delete', () => {
  test('Delete with ID', async () => {
    const res = await UserModel.delete(1);
    expect(res).toBe(1);
  });
});
