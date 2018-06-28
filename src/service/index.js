import { Validate, Sanitize } from '@/validator';

class Service {
  constructor({ allowedParams, validate, model, hooks }) {
    this.allowedParams = allowedParams || [];
    this.validate = validate || {};
    this.Model = model;
    this.hooks = hooks || { before: {}, after: {} };
  }

  service(method) {
    if (!this[method]) throw new Error('Method not defined');
    return this[method].bind(this);
  }

  async executeHook(target, method, params, ctx) {
    if (!this.hooks.target) Promise.resolve();
    const hook = this.hooks[target][method];
    if (hook && hook.length) {
      /* eslint-disable */
      for (const fn of hook) {
        const res = await fn(params, ctx);
        if (res === false) break;
       }
      /* eslint-enable */
    }
  }

  beforeHook(method, params, ctx) {
    return this.executeHook('before', method, params, ctx);
  }

  afterHook(method, params, ctx) {
    return this.executeHook('after', method, params, ctx);
  }

  async run(method, params, ctx) {
    // Whitelist
    if (this.allowedParams.length && method === 'get')
      params = Sanitize(params, this.allowedParams);
    // Validate
    if (this.validate[method]) {
      const validationResult = Validate(params, this.validate[method]);
      if (validationResult) throw validationResult;
    }
    if (!this[method]) throw new Error('Method Not Defined in Service');
    await this.beforeHook('all', params, ctx);
    await this.beforeHook(method, params, ctx);
    if (this.Model) {
      const res = await this[method](params, ctx);
      await this.afterHook('all', res, ctx);
      await this.afterHook(method, res, ctx);
      return res;
    }
    await this.afterHook('all', {}, ctx);
    await this.afterHook(method, {}, ctx);
  }

  async get(params) {
    return this.Model.find(params);
  }

  async getOne(params) {
    return this.Model.findOne(params);
  }

  async post(data) {
    return this.Model.create(data);
  }

  async upsert(where, data) {
    return this.Model.upsert(where, data);
  }

  async patch(data) {
    return this.Model.update(data.id, data);
  }

  async delete(id) {
    return this.Model.delete(id);
  }
}

export default Service;
