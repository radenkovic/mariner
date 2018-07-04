# Model

Model is a minimal and high level abstraction layer for SQL databases. It implements [knex](https://knexjs.org) library. Out of the box it supports:

1. Postgresql 
2. SQLite 
3. MySQL
4. MariaSQL
5. Oracle
6. MSSQL

You need to install adapter for your database manually.

## Creating a Model

To create a model import the base model class and pass a configuration object:

```text
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

* table`<string>` \(required\) - name of the table in the database
* config`<object>` \(required\) - configuration for the database adapter \(see [knex](https://knexjs.org/#Installation-client)\)
* sanitize`<object>` - sanitize params before every model method, described [below](model.md#sanitization)
* idField`<string | number>` - primary key of the table, defaults to `id`

## Methods

Model supports next methods:

1. [find](model.md#model-find-query)
2. [findOne](model.md#model-findone-query)
3. [create](model.md#model-create-query)
4. [update](model.md#model-update-query)
5. [upsert](model.md#model-upsert-query)
6. [delete](model.md#model-delete-query)

#### Model.find \(query\)

Finds data that matches provided query.

Sample:

```text
UserModel.find({ id: { $in: [1, 2, 3] }, email: 'test@user.com' })
```

#### Model.findOne \(query\)

Finds data that matches provided query and returns only the first result.

Sample:

```text
UserModel.findOne({ id: 1 })
```

#### Model.create \(data\)

Does a database insert with provided payload \(data\).

Sample:

```text
UserModel.create({ email: 'test@user.com', password: 'asdfasdf' })
```

#### Model.update \(data\)

Updates a record by primary key. Payload needs to include `id` \(or proper idField\).

Sample:

```text
UserModel.update({ id: 5, name: 'newUser' })
```

#### Model.upsert \(data\)

Upsert model will update existing data, or create a new record if there is no data with provided query. Upsert requires `$where` param, which is basically the query for `find` function. If nothing matches `$where` query, new record is added.

**CAUTION:** If `$where` matches multiple records, only the first one will be updated.

Sample:

```text
UserModel.upsert({ name: 'Dan', $where: { email: 'dan@node-mariner.io'} })
```

#### Model.delete \(id\)

Deletes a record from the database for provided `id` \(idField\).

Sample:

```text
UserModel.delete(1)
```

## Sanitization

You can define `sanitize` function in constructor, to sanitize data before executing the method \(applies to all methods\). Sanitize functions must be sync.

Sample:

```text
const SafeModel({
  table: 'user',
  config, // omitted for clarity
  sanitize: {
    username: (username) => username.toLowerCase().trim()
  }
})

// Find
SafeModel.findOne({ username: '   JOHN ' }) // is queried for 'john'

// Create
SafeModel.crate({ username: 'TEST' }) // record will have username: 'test'
```

## Data Filtering, Sorting and Pagination

All params can be used for `find` or `findAll` method, and in `$where` for `upsert` method.

### Basic Filtering

Field level search:

**$in**

`{ id: { $in: [1,2] } }` - finds entries that have id 1 or 2

**$nin**

`{ id: { $nin: [1,2] } }` - finds entries that do not have id 1 or 2

**$lt**

`{ id: { $lt: 5 } }` - finds entries that have id less than 5

**$lte**

`{ id: { $lte: 5 } }` - finds entries that have id less than or equal 5

**$gt**

`{ id: { $gt: 5 } }` - finds entries that have id greater than 5

**$gte**

`{ id: { $gte: 5 } }` - finds entries that have id greater than or equal 5

**$between**

`{ id: { $between: [1, 5] } }` - finds entries that have ids between 1 and 5 \(including 1 and 5\)

**$notBetween**

`{ id: { $notBetween: [1, 5] } }` - finds entries that do not have ids between 1 and 5 \(excluding 1 and 5\)

**$null**

`{ id: { $null: true }}` - finds entries where id is null \(use `$null: false` to invert the results\)

**$or**

`{ $or: { email: 'test@user.com', username: 'dan' } }` - finds entries where email is `test@user.com` or username is `dan`

### Pagination

Pagination is done by utilizing `$limit` and `$skip`. By default, `$limit` is set to 10.

```text
UserModel.find({ $limit: 50, $skip: 10 } })
```

### Sorting Data

Data can be sorted by one property, using `$sort`. Direction is optional and defaults to `desc`.

```text
UserModel.find({ $sort: { field: 'id', direction: 'asc' || 'desc' } } })
```

