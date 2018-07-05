import express from 'express';
import bodyParser from 'body-parser';
import registerRoutes from './handlers/register-routes';
import users from './resources/user';
import posts from './resources/post';
import authenticate from './resources/auth';

const app = express();
app.use(bodyParser.json());

// Register Services (post and user)
registerRoutes(app, users);
registerRoutes(app, posts);

app.post('/authenticate', authenticate);

app.listen(3000, () =>
  console.log('Mariner Express app listening on port 3000!')
);
