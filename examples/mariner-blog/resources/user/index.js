import saltHash from '../../../../src/utils/salt-hash';
import authorize from '../auth/authorize.middleware';
import service from './user.service';

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
