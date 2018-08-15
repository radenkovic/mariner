# Service


Service is the "glue" for and main interaction point between user and backend.
In traditional Model-View-Controller design architecture, it represents Controller.


Service provides methods for user input sanitization, whitelisting and validation. It can
be bound to regular Mariner [Model](https://docs.marinerjs.com/modules/model) or to custom-tailored
model. Also, by default it users Mariner [Validator](https://docs.marinerjs.com/utils/validator),
but you can easily replace it with custom one.


# Creating and configuring Service


To create a Service, we pass a configuration object.


```
import { Service } from 'node-mariner';
import UserModel from './models'; // omitted for clarity

const User = new Service({
  name: 'User'
  model: UserModel
});
```

### Configuration Object

Only required properties are `model` and `name`.

| key                | type      | description                                                                                   |
| -------------------|-----------|-----------------------------------------------------------------------------------------------|
| name               | `string`  | name of the service |
| model              | `object`  | mariner model, or custom model (class) that has methods `find`, `findOne`, `create`, `update`, `delete` |
| model              | `object`  | mariner model, or custom model (class) that has methods `find`, `findOne`, `create`, `update`, `delete` |
| sanitize           | `object`  | optional sanitization configuration, described below |
| validate           | `object`  | optional validation configuration, described below |
| validator          | `function`| optional validation function, to replace the default validator, described below |
| sanitizer          | `function`| optional sanitization function, to replace the default sanitizer, described below |
| emitFn             | `function`| optional function that is run after every successful service method, described below |


## Basic Service methods

In previous step, we instantiated the service, calling service methods can be done as follows:

```
const arrayOfUsers = await User.service('find', { name: 'Dan' });

const secondUser = await User.service('findOne', { id: 2 });

const createdUser = await User.service('create', { name: 'Special' });

const updatedUser = await User.service('update', { id: 2, name: 'Updated' });

const deletedUser = await User.service('delete', 2);

const createdOrUpdatedUser = await User.service('upsert', {
  $where: { email: 'dan@radenkovic.org' },
  name: 'D A N'
});
```


### Default Service Methods


Service provides 5 default service methods, though it can be extended or overriden.

| key                | description                                                                                   |
| -------------------|-----------------------------------------------------------------------------------------------|
| find               | finds all results for matching query, in case of 0 results returns empty array                |
| findOne            | tries to find result for given query, in case of 0 results it throws an exception             |
| create             | creates a new entry                                                                           |
| update             | updates an entry, `id` field is mandatory in payload                                          |
| delete             | deletes an entry, payload is id of entry to be deleted                                        |
| upsert             | updates or creates a new entry, depending on `$where` predicate query                         |


### Adding, overriding and deleting methods


To extend or override a service with your custom method, just extend the instantiated object:

```

User.customMethod = function(payload) {
  // some logic here
  return payload
}

// To call it
User.service('customMethod', {hello: true})
export default User;
```

Deleting (method not allowed):

```
const User = new Service({ ... });
delete User.create;
export default User
```

## Sanitization

Often, you need to prevent user from sending inappropriate parameters, so you can create a whitelist
of allowed params that Service accepts. All other params will be ignored. You need to pass a Configuration
object as follows `methodName`: `[Array of accepted fields]`.

```
const Post = new Service({
  model,
  name: 'Post',
  sanitize: {
    find: ['body', 'title', 'created_at', 'updated_at', 'user_id'],
    create: ['id', 'title', 'body', 'user_id'],
    update: ['id', 'title', 'body']
  }
});

Post.service('create', { title: 'this will pass', random: 'this will be ignored'})
```

Sanitization works also for nested structures, for example: 
`const sanitize = { find: ['address.street'] }`
will allow users to add address object, with street property.


## Validation

By default, Service uses [validate.js](https://validatejs.org/), and all validators
can be used.

```
export default new Service({
  model,
  name: 'Post',
  validate: {
    create: {
      title: { presence: true },
      email: { presence: true, email: true },
      user_id: { presence: true }
    }
  }
});
```

## Replacing default validator and sanitizer

You can replace both validator and sanitizer, by passing custom functions:


```
export default new Service({
  model,
  name: 'Post',
  validator: (data, constraints) => undefined,
  sanitizer: (data, whitelist, passThru) => data
});
```

Validator function accepts `data` and `constraints` as second argument and should return `undefined` 
if data is valid, or to return error object with information about errors.


Sanitizer accepts `data`, `whitelist` and `passThru`. `whitelist` is an array of allowed fields.
`passthru` is an array of keys that should be ignored in sanitizer if using default Mariner model (`$or`, `$where`, etc...).


## Emit function

After every successful method, emit function will be called, if provided. 

```
export default new Service({
  model,
  name: 'Post',
  emitFn: (eventName, payload, params) => {
    // some logic here
  }
});
```

Function signature has 3 arguments:

1. `eventName`, for example, after creating an user, eventName is `user:create`
2. `payload`, data of newly created user (after creation)
3. `params`, params used to create an user (before creation)










