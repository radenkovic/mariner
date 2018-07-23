import { Authenticate } from '../../../../src';
import UserService from '../user/user.service';
import { verifyPassword } from '../../../../src/utils/salt-hash';

// Configuring the module
export const Auth = new Authenticate({
  secret: 'DEAD_SIMPLE_KEY',
  authorizationFn: ({ login }) =>
    UserService.service('findOne', {
      $or: { username: login, email: login }
    })
});

export default async (req, res, next) => {
  try {
    const user = await Auth.authenticate(req.body);
    verifyPassword({
      enteredPassword: req.body.password,
      password: user.password,
      salt: user.salt
    });
    delete user.salt;
    delete user.password;
    res.json(user);
    next();
  } catch (e) {
    res.status(401);
    res.json(e);
    next(e);
  }
};
