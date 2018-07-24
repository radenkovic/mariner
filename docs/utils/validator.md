# Validator

Validator is [validate.js](https://validatejs.org/) implementation, with few
custom validators (date) and uses the same api as provided in validate.js documentation.
It's also default validator of [Mariner Service](https://docs.marinerjs.com/modules/service).

```
import { Validator } from 'node-mariner';

const validations = {
  email: { email: true }
}

const goodData = {
  email: 'notemail.com'
}

const badData = {
  email: 'dan@test.com'
}

const errors = Validator(goodData, validations);
// errors is undefined

const errors = Validator(badData, validations);
// errors contains validation errors

``