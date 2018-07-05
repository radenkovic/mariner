import { Auth } from '../routes/authenticate';

export default (req, res, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.split('Bearer ')[1]
    : null;
  try {
    req.user = Auth.verify(token);
    return next();
  } catch (e) {
    res.status(401);
    return next('not authorized');
  }
};
