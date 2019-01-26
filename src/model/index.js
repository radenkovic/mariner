// @flow
import knex from 'knex';
import { NoConfigException, InvalidParamException } from './model.exceptions';

const findParams = [
  '$in',
  '$nin',
  '$lt',
  '$lte',
  '$gt',
  '$gte',
  '$between',
  '$notBetween',
  '$null'
];
interface BaseModel {
  find(): Promise<*>;
  findOne(): Promise<*>;
  create(data: Object): Object;
  update(id: number | string, data: Object): Object;
  delete(id: string | number): Promise<*>;
}

type ModelConfig = {
  table: string,
  idField?: string,
  sanitize?: Object,
  config: Object
};

type WhereConfig = {
  $limit?: Number,
  $skip?: Number,
  $sort?: Object,
  $or?: Object,
  [string]: {
    $nin?: Array<string | number>,
    $in?: Array<string | number>
  }
};

export default class Model implements BaseModel {
  table = '';

  db = {};

  idField = 'id';

  sanitize = null;

  constructor({ table, idField, sanitize, config }: ModelConfig) {
    // Preflight check
    if (!table)
      throw new NoConfigException(
        'Cannot instantiate model, please supply table'
      );
    if (!config)
      throw new NoConfigException(
        'Cannot instantiate model, please supply config object'
      );

    this.table = table;
    this.db = knex(config);
    this.idField = idField || 'id';
    this.sanitize = sanitize;
  }

  find(where: WhereConfig = {}) {
    const params = {
      $limit: where.$limit,
      $skip: where.$skip,
      $or: where.$or,
      $sort: where.$sort
    };
    const q = this.db.table(this.table);

    Object.keys(where).map(key => {
      // Where example { username: { '$in': [ '  dan', 'bogdan' ] } }
      if (typeof where[key] === 'object' && where[key] !== null) {
        Object.keys(where[key]).map(sk => {
          // sk example "username", val { '$in': [ '  dan', 'bogdan' ] }
          // $FlowFixMe
          const val = where[key][sk];
          // Reject fake params
          if (!findParams.includes(sk) && key !== '$or' && key !== '$sort')
            throw new InvalidParamException(sk);
          else if (sk === '$in')
            // $FlowFixMe
            q.whereIn(key, val.map(item => this.sanitizeParam(key, item)));
          else if (sk === '$nin')
            // $FlowFixMe
            q.whereNotIn(key, val.map(item => this.sanitizeParam(key, item)));
          else if (sk === '$lt')
            q.where(key, '<', this.sanitizeParam(key, val));
          else if (sk === '$lte')
            q.where(key, '<=', this.sanitizeParam(key, val));
          else if (sk === '$gt')
            q.where(key, '>', this.sanitizeParam(key, val));
          else if (sk === '$gte')
            q.where(key, '>=', this.sanitizeParam(key, val));
          else if (sk === '$between')
            // $FlowFixMe
            q.whereBetween(key, val.map(item => this.sanitizeParam(key, item)));
          else if (sk === '$notBetween')
            q.whereNotBetween(
              key,
              // $FlowFixMe
              val.map(item => this.sanitizeParam(key, item))
            );
          else if (sk === '$null' && val === true) q.whereNull(key);
          else if (sk === '$null' && val === false) q.whereNotNull(key);
          // if (sk === '$raw') q.whereRaw(val);
          return null;
        });
        delete where[key];
      }
      return null;
    });
    delete where.$limit;
    delete where.$skip;
    delete where.$or;
    delete where.$sort;

    this.sanitizeParams(where);

    q.where(where);
    q.limit(params.$limit || 10);
    if (params.$skip) q.offset(params.$skip);
    if (params.$or) {
      const { $or } = params;
      this.sanitizeParams($or);
      Object.keys($or).map(key => {
        // $FlowFixMe
        q.orWhere(key, params.$or[key]);
        return null;
      });
    }
    if (params.$sort) {
      q.orderBy(params.$sort.field, params.$sort.direction || 'desc');
    }
    return q;
  }

  findOne(where: Object = {}) {
    return this.find(where).first();
  }

  async create(data: Object) {
    this.sanitizeParams(data);
    const res = await this.db
      .table(this.table)
      .insert(data)
      .returning('*');
    return res[0];
  }

  async update(id: string | number, data: Object) {
    this.sanitizeParams(data);
    delete data[this.idField];
    const res = await this.db
      .table(this.table)
      .update(data)
      .where({ [this.idField]: id })
      .returning('*');
    return res.length ? res[0] : null;
  }

  async upsert(where: Object | void, data: Object) {
    this.sanitizeParams(data);
    const find = await this.findOne(where);
    if (!find) {
      const res = await this.create(data);
      return {
        data: res,
        mode: 'create'
      };
    }

    const res = await this.update(find[this.idField], data);
    return {
      data: res,
      mode: 'update'
    };
  }

  delete(id: string | number) {
    return this.db
      .table(this.table)
      .del()
      .where({ [this.idField]: id });
  }

  sanitizeParam(key: string, value: any): any {
    if (this.sanitize && this.sanitize[key]) return this.sanitize[key](value);
    return value;
  }

  sanitizeParams(data: Object) {
    // Remove undefined values
    Object.keys(data).forEach(key =>
      data[key] === undefined ? delete data[key] : ''
    );

    if (!this.sanitize) return;
    Object.keys(this.sanitize).forEach(key => {
      // $FlowFixMe
      if (data[key]) data[key] = this.sanitize[key](data[key]);
    });
  }
}
