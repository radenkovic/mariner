import { Authenticate } from '../../../src';
import model from '../models/user';
import { verifyPassword } from '../../../src/utils/salt-hash';

const authorizationFn = async ({ username, email }) => {
  let user = null;
  if (username) user = await model.findOne({ username });
  if (email) user = await model.findone({ email });
  if (!user) throw new Error('User not found');
  // Do not store pass and salt in token!
  delete user.password;
  delete user.salt;
  return user;
};

export const Auth = new Authenticate({
  secret: 'DEAD_SIMPLE_KEY',
  authorizationFn
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
    next(e);
  }
};
