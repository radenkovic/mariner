import authorize from '../middleware/authorize';
import service from '../services/post';

// Hooks
const isOwner = async (req, res, next) => {
  try {
    await service.service('findOne', {
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
  service,
  routes: ['posts', 'users/:user_id/posts'],
  before: {
    create: [authorize],
    update: [authorize, isOwner]
  }
};
