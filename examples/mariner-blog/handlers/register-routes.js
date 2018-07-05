import createUpdateHandler from './create-update';
import getHandler from './get';
import deleteHandler from './delete';

const render = (req, res) => res.json(req.data);

export default (app, { service, before = {}, after = {}, route }) => {
  // Register Routes
  app.get(`/${route}/:id?`, [
    ...(before.all || []),
    ...(before.get || []),
    getHandler(service),
    ...(after.all || []),
    ...(after.get || []),
    render
  ]);

  app.post(`/${route}?`, [
    ...(before.all || []),
    ...(before.create || []),
    createUpdateHandler(service),
    ...(after.all || []),
    ...(after.create || []),
    render
  ]);

  app.patch(`/${route}/:id?`, [
    ...(before.all || []),
    ...(before.update || []),
    createUpdateHandler(service),
    ...(after.all || []),
    ...(after.update || []),
    render
  ]);

  app.delete(`/${route}/:id?`, [
    ...(before.all || []),
    ...(before.delete || []),
    deleteHandler(service),
    ...(after.all || []),
    ...(after.delete || []),
    render
  ]);
};
