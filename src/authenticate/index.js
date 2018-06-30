import jwt from 'jsonwebtoken';

import {
  NoAuthorizationFunctionException,
  NotAutorizedException,
  AuthenticateNoConfigException
} from './authenticate.exceptions';

export default class Authenticate {
  static getTokenFromHeader(header) {
    return header.split('Bearer ')[1];
  }

  static createAuthorizationHeader(token) {
    return `Bearer ${token}`;
  }

  constructor(config) {
    if (!config) throw new AuthenticateNoConfigException();
    const { secret, authorizationFn } = config;
    this.secret = secret;
    this.get = authorizationFn;
  }

  sign(data) {
    return jwt.sign(data, this.secret);
  }

  verify(token) {
    const res = jwt.verify(token, this.secret);
    return res;
  }

  async authenticate(payload) {
    if (!this.get) throw new NoAuthorizationFunctionException(payload);
    try {
      const user = await this.get(payload);
      const token = this.sign(payload);
      return {
        ...user,
        access_token: token
      };
    } catch (e) {
      throw new NotAutorizedException(payload);
    }
  }
}
