import express from 'express';
import bodyParser from 'body-parser';
import registerRoutes from './handlers/register-routes';
import users from './routes/users';
import posts from './routes/posts';
import authenticate from './routes/authenticate';

const app = express();
app.use(bodyParser.json());

registerRoutes(app, users);
registerRoutes(app, posts);
registerRoutes(app, { ...posts, route: 'users/:user_id/posts/:id?' });

app.post('/authenticate', authenticate);

app.listen(3000, () =>
  console.log('Mariner Express app listening on port 3000!')
);
