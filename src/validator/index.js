import validate from 'validate.js';
import moment from 'moment';

validate.extend(validate.validators.datetime, {
  parse(value) {
    return +moment.utc(value);
  },
  format(value) {
    const date = moment(value);
    return date.isValid();
  }
});

export const Sanitizer = (data, whitelist, passThru) => {
  if (whitelist && whitelist.length) {
    const cleaned = {};
    whitelist.forEach(item => {
      cleaned[item] = true;
    });
    const result = validate.cleanAttributes(data, cleaned);
    // Pass Thru
    if (passThru) {
      passThru.forEach(item => {
        result[item] = data[item];
      });
    }
    return result;
  }
  return data;
};

export const Validator = (data, constraints) => validate(data, constraints);
