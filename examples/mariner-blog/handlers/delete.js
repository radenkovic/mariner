import errorHandler from './error';

export default service => async (req, res, next) => {
  try {
    await service.service('delete', req.params.id);
    return res.end();
  } catch (e) {
    const { status, data } = errorHandler(e);
    res.status(status);
    res.json(data);
    return next(e);
  }
};
