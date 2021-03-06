# Model

Model is a minimal and high level abstraction layer for SQL databases. It 
implements [knex](https://knexjs.org) library. You need to install adapter for your database manually. 
For more info check [initializing the library](https://knexjs.org/#Installation-client).

**NOTE**: Knexjs supports Postgres, MSSQL, MySQL, MariaDB, SQLite3, Oracle, and Amazon Redshift, however,
all adapters are not tested with the model. If some methods do not work as expected, feel free to open a github issue.


## Creating a Model

To create a model import the base model class and pass a configuration object:

```
import { Model } from 'node-mariner'

const UserModel = new Model({
  table: 'user_test',
  config: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: '',
      database: 'node-mariner'
    }
  }
})

```


### Configuration Object

All keys are mandatory unless stated differently.

| key                | type     | description                                                                                   |
| -------------------|----------|-----------------------------------------------------------------------------------------------|
| table              | `string` | name of the table in the database                                                             |
| config             | `object` | configuration for the database adapter (see [knex](https://knexjs.org/#Installation-client))  |
| sanitize (optional)| `object` | sanitize params before every model method, described [below](#sanitization)                   |
| idField (optional) | `string` | primary key of the table, defaults to `id`                                                    |



## Methods

### Model.find (query)

Finds data that matches provided query.

```
UserModel.find({ id: { $in: [1, 2, 3] }, email: 'test@user.com' })
```

### Model.findOne (query)

Finds data that matches provided query and returns only the first result.

```
UserModel.findOne({ id: 1 })
```

### Model.create (data)

Does a database insert with provided payload (data).

```
UserModel.create({ email: 'test@user.com', password: 'asdfasdf' })
```

### Model.update (data)

Updates a record by primary key. First argument is id (idField).
```
UserModel.update(5, { name: 'newUser' })
```

### Model.upsert (data)

Upsert model will update existing data, or create a new record if there is no data with provided query.
Upsert requires `$where` param, which is basically the query for `find` function.
If nothing matches `$where` query, new record is added.

**CAUTION:** If `$where` matches multiple records, only the first one will be updated.

```
UserModel.upsert({ name: 'Dan', $where: { email: 'dan@node-mariner.io'} })
```

### Model.delete (id)

Deletes a record from the database for provided `id` (idField).

```
UserModel.delete(1)
```

## Data Filtering, Sorting and Pagination

All params can be used for `find` or `findAll` method, and in `$where` 
for `upsert` method.


### Basic Filtering

Field level search:


| key               | sample                                            | description                                 |
| ------------------|---------------------------------------------------|---------------------------------------------|
| $in               | `{ id: { $in: [1,2] } }`                          | finds entries that have id 1 or 2          |
| $nin              | `{ id: { $nin: [1,2] } }`                         | finds entries that do not have id 1 or 2  |
| $lt               | `{ id: { $lt: 5 } }`                              | finds entries that have id less than 5   |
| $lte              | `{ id: { $lte: 5 } }`                             | finds entries that have id less than or equal 5   |
| $gt               | `{ id: { $gt: 5 } }`                              | finds entries that have id greater than 5   |
| $gte              | `{ id: { $gte: 5 } }`                             | finds entries that have id greater than or equal 5   |
| $between          | `{ id: { $between: [1, 5] } }`                    | finds entries that have ids between 1 and 5 (including 1 and 5)   |
| $notBetween       | `{ id: { $notBetween: [1, 5] } }`                 | finds entries that do not have ids between 1 and 5 (excluding 1 and 5)   |
| $null             | `{ id: { $null: true }}`                          | finds entries where id is null (use `$null: false` to invert the results)   |
| $or               | `{ $or: { email: 't@cd.com', username: 'dan' } }` | finds entries where email is `t@cd.com` or username is `dan`   |



### Pagination

Pagination is done by utilizing `$limit` and `$skip`. By default, `$limit` is 
set to 10.

```
UserModel.find({ $limit: 50, $skip: 10 } })
```

### Sorting Data

Data can be sorted by one property, using `$sort`. Direction is optional and
defaults to `desc`.


```
UserModel.find({ $sort: { field: 'id', direction: 'asc' || 'desc' } } })
```


## Sanitization 

You can define `sanitize` function in constructor, to sanitize data before
executing the method (applies to all methods). Sanitize functions must be sync.

```
const SafeModel = new Model({
  table: 'user',
  config, // omitted for clarity
  sanitize: {
    username: (username) => username.toLowerCase().trim()
  }
})

// Find
SafeModel.findOne({ username: '   JOHN ' }) // is queried for 'john'

// Create
SafeModel.create({ username: 'TEST' }) // record will have username: 'test'

```

## Extending the Model

At some point you may need to utilize some of the knex methods or create custom methods. 
You can achieve this by extending the model.


```
const CustomModel = new Model({
  table: 'user',
  config, // omitted for clarity
})

// Create Method
CustomModel.specificGet = () => {
  return this.db.find({ id: 1 }) // this.db.find equals knex('user').find(...)
}

// Call Method
SafeModel.specificGet() // returns user with id: 1
```


