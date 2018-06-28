import jwt from 'jsonwebtoken';

export default class Authenticate {
  constructor({ secret, get }) {
    this.secrect = secret;
    this.get = get;
  }

  authorize(token) {
    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, this.secret, (err, decodedUser) => {
        if (err) throw new Error('Could not decode Token');
        // if everything is good, save to request for use in other routes
        return decodedUser;
      });
    }
    return null;
  }

  async authenticate(payload) {
    const user = await this.get(payload);
    if (!user) throw new Error('Could not authenticate');
    const token = jwt.sign(user, this.secret);
    return {
      user,
      token
    };
  }
}
