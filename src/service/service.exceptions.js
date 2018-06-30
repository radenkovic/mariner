export function MethodNotAllowedException(method) {
  this.message = 'Method not allowed';
  this.method = method;
}

export function UpdateWithoutIdException(data) {
  this.message = 'Update data requires id value';
  this.method = 'update';
  this.data = data;
}

export function UpsertWithoutWhereException(data) {
  this.message = 'Upsert Required $where param in data';
  this.method = 'upsert';
  this.data = data;
}

export function NoConfigurationException() {
  this.message = 'Cannot create Service without config object';
}
