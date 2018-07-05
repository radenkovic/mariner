import errorHandler from './error';

export default service => async (req, res, next) => {
  try {
    if (req.params.id) {
      // Find One
      const data = await service.service('findOne', { ...req.params });
      req.data = data;
      return next();
    }
    // Find All
    const obj = { ...req.query, ...req.params };
    const data = await service.service('find', obj);
    req.data = data;
    return next();
  } catch (e) {
    console.log(e);
    const { status, data } = errorHandler(e);
    res.status(status);
    res.json(data);
    return next(e);
  }
};
