import saltHash from '../../../src/utils/salt-hash';
import { Service } from '../../../src';
import authorize from '../middleware/authorize';
import model from '../models/user';

const service = new Service({
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

// Hooks
const hashPassword = (req, res, next) => {
  if (req.body.password) {
    const { hash, salt } = saltHash(req.body.password);
    req.body.salt = salt;
    req.body.password = hash;
  }
  next();
};

const removePassword = (req, res, next) => {
  const transform = item => {
    delete item.password;
    delete item.salt;
    return item;
  };
  req.data = Array.isArray(req.data)
    ? req.data.map(transform)
    : transform(req.data);
  next();
};

const isOwner = (req, res, next) => {
  if (req.user.id !== parseInt(req.params.id, 0)) {
    res.status(401);
    return next('Not owner of the resource');
  }
  return next();
};

export default {
  service,
  route: 'users',
  before: {
    create: [hashPassword],
    update: [authorize, isOwner, hashPassword],
    delete: [authorize]
  },
  after: {
    all: [removePassword]
  }
};
