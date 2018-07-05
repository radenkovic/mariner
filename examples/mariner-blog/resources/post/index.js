import authorize from '../auth/authorize.middleware';
import PostService from './post.service';

// Hooks
const isOwner = async (req, res, next) => {
  try {
    await PostService.service('findOne', {
      id: req.params.id,
      user_id: req.user.id
    });
    return next();
  } catch (e) {
    res.status(404);
    res.json(e);
    return next(e);
  }
};

export default {
  service: PostService,
  routes: ['posts', 'users/:user_id/posts'],
  before: {
    create: [authorize],
    update: [authorize, isOwner],
    delete: [authorize, isOwner]
  }
};
