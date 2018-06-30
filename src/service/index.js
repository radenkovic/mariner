import { Validator, Sanitizer } from '@/validator';

import {
  NoConfigurationException,
  MethodNotAllowedException,
  UpdateWithoutIdException,
  UpsertWithoutWhereException
} from './service.exceptions';

const passThru = ['$limit', '$skip', '$sort', '$where', '$or'];

class Service {
  constructor(config) {
    if (!config) throw new NoConfigurationException();
    const { sanitize, validate, model, validator, sanitizer } = config;
    this.sanitize = sanitize || {};
    this.validate = validate || {};
    this.Model = model;
    this.Validator = validator || Validator;
    this.Sanitizer = sanitizer || Sanitizer;
  }

  async service(method, params) {
    // Whitelist
    if (!this[method]) throw new MethodNotAllowedException(method);
    if (this.sanitize[method]) {
      params = this.Sanitizer(params, this.sanitize[method], passThru);
    }
    // Validate
    if (this.validate[method]) {
      const validationResult = this.Validator(params, this.validate[method]);
      if (validationResult) throw validationResult;
    }
    if (this.Model) {
      return this[method](params);
    }

    return params;
  }

  async find(params) {
    return this.Model.find(params);
  }

  async findOne(params) {
    return this.Model.findOne(params);
  }

  async create(data) {
    return this.Model.create(data);
  }

  async update(data) {
    const id = data[this.Model.idField];
    if (!id) throw new UpdateWithoutIdException(data);
    delete data[this.Model.idField];
    return this.Model.update(id, data);
  }

  async upsert(data) {
    const where = data.$where;
    if (!where) throw new UpsertWithoutWhereException(data);
    delete data[this.Model.idField];
    delete data.$where;
    return this.Model.upsert(where, data);
  }

  async delete(id) {
    return this.Model.delete(id);
  }
}

export default Service;
