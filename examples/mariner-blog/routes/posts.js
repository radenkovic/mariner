import { Service } from '../../../src';
import model from '../models/post';
import authorize from '../middleware/authorize';

const service = new Service({
  model,
  name: 'Post',
  sanitize: {
    find: ['body', 'title', 'created_at', 'updated_at', 'user_id'],
    create: ['id', 'title', 'body', 'user_id'],
    update: ['id', 'title', 'body']
  },
  validate: {
    create: {
      title: { presence: true },
      body: { presence: true },
      user_id: { presence: true }
    }
  }
});

// Hooks
const isOwner = async (req, res, next) => {
  const result = await model.findOne({
    id: req.params.id,
    user_id: req.user.id
  });
  if (!result) {
    res.status(404);
    return next('Not owner');
  }
  return next();
};

export default {
  service,
  before: {
    create: [authorize],
    update: [authorize, isOwner]
  },
  route: 'posts'
};
