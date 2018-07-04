const express = require('express');
const bodyParser = require('body-parser');
const { Model, Service } = require('./../../dist/index');

const config = require('./knexfile');

const User = new Model({
  table: 'user',
  config
});

const UserService = new Service({
  model: User,
  name: 'UserService',
  sanitize: {
    get: ['username', 'password']
  },
  validate: {
    create: {
      username: { presence: true },
      email: { presence: true },
      password: { presence: true },
      salt: { presence: true }
    }
  }
});

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => res.json({ status: 'up' }));

app.get('/users', async (req, res, next) => {
  try {
    const users = await UserService.find(req.query.params);
    res.json(users);
  } catch (e) {
    next(e);
  }
});

app.get('/users/:id', async (req, res) => {
  const user = await UserService.findOne({ id: req.params.id });
  res.json(user);
});

app.post('/users', async (req, res) => {
  try {
    const user = await UserService.service('create', {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email
    });
    res.json(user);
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
