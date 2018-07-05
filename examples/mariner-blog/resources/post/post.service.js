import { Service } from '../../../../src';
import model from './post.model';

export default new Service({
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
