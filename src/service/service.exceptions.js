export function MethodNotAllowedException(method) {
  this.code = 'method-not-allowed';
  this.message = 'Method not allowed';
  this.method = method;
}

export function UpdateWithoutIdException(data) {
  this.code = 'update-without-id';
  this.message = 'Update data requires id value';
  this.method = 'update';
  this.data = data;
}

export function UpsertWithoutWhereException(data) {
  this.code = 'upsert-without-where';
  this.message = 'Upsert Required $where param in data';
  this.method = 'upsert';
  this.data = data;
}

export function NoConfigurationException() {
  this.code = 'no-configuration';
  this.message = 'Cannot create Service without config object';
}

export function ValidationException(data) {
  this.code = 'validation';
  this.data = data;
  this.message = 'Validation of one or more fields failed';
}

export function NotFoundException(service, id) {
  this.code = 'not-found';
  this.data = { id };
  this.message = `Record with id ${id} not found in ${service}`;
}
