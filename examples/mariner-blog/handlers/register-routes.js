import createUpdateHandler from './create-update';
import getHandler from './get';
import deleteHandler from './delete';

const render = (req, res) => res.json(req.data);

export default (app, { service, before = {}, after = {}, route, routes }) => {
  const r = routes || [route];
  r.forEach(routeName => {
    // Register Routes
    app.get(`/${routeName}/:id?`, [
      ...(before.all || []),
      ...(before.get || []),
      getHandler(service),
      ...(after.all || []),
      ...(after.get || []),
      render
    ]);

    app.post(`/${routeName}?`, [
      ...(before.all || []),
      ...(before.create || []),
      createUpdateHandler(service),
      ...(after.all || []),
      ...(after.create || []),
      render
    ]);

    app.patch(`/${routeName}/:id?`, [
      ...(before.all || []),
      ...(before.update || []),
      createUpdateHandler(service),
      ...(after.all || []),
      ...(after.update || []),
      render
    ]);

    app.delete(`/${routeName}/:id?`, [
      ...(before.all || []),
      ...(before.delete || []),
      deleteHandler(service),
      ...(after.all || []),
      ...(after.delete || []),
      render
    ]);
  });
};
