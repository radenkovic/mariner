import errorHandler from './error';

export default service => async (req, res, next) => {
  try {
    // Create / Update User
    const method = req.method === 'POST' ? 'create' : 'update';
    if (method === 'update') req.body.id = req.params.id;
    const data = await service.service(method, req.body);
    req.data = data;
    return next();
  } catch (e) {
    const { status, data } = errorHandler(e);
    res.status(status);
    res.json(data);
    return next(e);
  }
};
