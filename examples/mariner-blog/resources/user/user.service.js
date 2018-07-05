import { Service } from '../../../../src';
import model from './user.model';

export default new Service({
  model,
  name: 'User',
  sanitize: {
    find: ['username', 'password', 'created_at', 'updated_at'],
    create: ['username', 'name', 'email', 'password', 'salt'],
    update: ['id', 'username', 'name', 'email', 'password', 'salt']
  },
  validate: {
    create: {
      username: { presence: true },
      email: { presence: true, email: true },
      password: { presence: true },
      salt: { presence: true }
    },
    update: {
      email: { email: true }
    }
  }
});
