import config from '../knexfile';
import { Model } from '../../../src';

export default new Model({
  table: 'user',
  config,
  sanitize: {
    username: x => x.toLowerCase().trim()
  }
});
