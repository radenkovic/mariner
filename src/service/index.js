import Validator, { Sanitizer } from '../utils/validator';

import {
  NoConfigurationException,
  MethodNotAllowedException,
  UpdateWithoutIdException,
  UpsertWithoutWhereException,
  ValidationException,
  NotFoundException
} from './service.exceptions';

const passThru = ['$limit', '$skip', '$sort', '$where', '$or'];

class Service {
  constructor(config) {
    if (!config) throw new NoConfigurationException();
    if (!config.name) throw new NoConfigurationException();
    const { sanitize, validate, model, validator, sanitizer } = config;
    this.name = config.name;
    this.model = model;
    this.sanitize = sanitize || {};
    this.validate = validate || {};
    this.validator = validator || Validator;
    this.sanitizer = sanitizer || Sanitizer;
    this.emitFn = config.emit;
  }

  emit(name, payload, params) {
    const eventName = `${this.name}:${name}`;
    if (this.emitFn && payload) {
      this.emitFn(eventName, payload, params);
    }
  }

  async service(method, params) {
    // Whitelist
    if (!this[method]) throw new MethodNotAllowedException(method);
    params = this.sanitizer(params, this.sanitize[method], passThru);
    // Validate
    if (this.validate[method]) {
      const validationResult = this.validator(params, this.validate[method]);
      if (validationResult) throw new ValidationException(validationResult);
    }
    if (this.model) {
      return this[method](params);
    }

    return params;
  }

  async find(params) {
    return this.model.find(params);
  }

  async findOne(params) {
    const res = await this.model.findOne(params);
    if (!res)
      throw new NotFoundException(this.name, params[this.model.idField]);
    return res;
  }

  async create(data) {
    const res = await this.model.create(data);
    this.emit('create', res, data);
    return res;
  }

  async update(data) {
    const id = data[this.model.idField];
    if (!id) throw new UpdateWithoutIdException(data);
    delete data[this.model.idField];
    const res = await this.model.update(id, data);
    if (!res) throw new NotFoundException(this.name, id);
    this.emit('update', res, data);
    return res;
  }

  async upsert(data) {
    const where = data.$where;
    if (!where) throw new UpsertWithoutWhereException(data);
    delete data[this.model.idField];
    delete data.$where;
    const res = await this.model.upsert(where, data);
    if (res.mode === 'update') this.emit('update', res, data);
    if (res.mode === 'create') this.emit('create', res, data);
    return res;
  }

  async delete(id) {
    const res = await this.model.delete(id);
    if (!res) throw new NotFoundException(this.name, id);
    this.emit('delete', id, res);
    return res;
  }
}

export default Service;
