# Model

Model is a minimal and high level abstraction layer for SQL databases. It 
implements [knex](https://knexjs.org) library. Out of the box it supports:

1. Postgresql (`yarn add pg`)*
2. SQLite (`yarn add sqlite3`)*
2. MySQL (`yarn add mysql`)*
3. MariaSQL (`yarn add mariasql`)*
4. Oracle (`yarn add oracle`)*
5. MsSQL (`yarn add mssql`)*

You need to install adapter for your database manually.

## Creating a Model

To create a model import the base model class and pass a configuration object:

```
import Model from 'node-toolbelt'

const UserModel = new Model({
  table: 'user_test',
  config: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: '',
      database: 'toolbelt'
    }
  }
})

```

### Configuration Object

* table`<string>` (required) - name of the table in the database
* config`<object>` (required) - configuration for the database adapter (see [knex](https://knexjs.org/#Installation-client))
* sanitize`<object>` - sanitize params before every model method, described [below](#sanitize)
* idField`<string | number` - primary key of the table, defaults to `id`

## Methods

Model supports next methods:

1. [find](#find-method)
2. [findOne](#findone-method)
3. [create](#create-method)
4. [update](#update-method)
5. [upsert](#upsert-method)
6. [delete](#delete-method)

### <a name="find-method"></a> Model.find (query)

Finds data that matches provided query.

Sample: 

```
UserModel.find({ id: { $in: [1, 2, 3] }, email: 'test@user.com' })
```

### <a name="find-method"></a> Model.findOne (query)

Finds data that matches provided query and returns only the first result.

Sample: 

```
UserModel.find({ id: 1 })
```

### <a name="create-method"></a> Model.create (data)

Does a database insert with provided payload (data).

Sample: 

```
UserModel.create({ email: 'test@user.com', password: 'asdfasdf' })
```

### <a name="update-method"></a> Model.update (data)

Updates a record by primary key. Payload needs to include `id` (or proper idField).


Sample: 

```
UserModel.update({ id: 5, name: 'newUser' })
```

### <a name="upsert-method"></a> Model.upsert (data)

Upsert model will update existing data, or create a new record if there is no data with provided query.
Upsert requires `$where` param, which is basically the query for `find` function.
If nothing matches `$where` query, new record is added.

_CAUTION:_ If `$where` matches multiple records, only the first one will be updated.

Sample:

```
UserModel.upsert({ name: 'Dan', $where: { email: 'dan@toolbelt.org'} })
```

### <a name="delete-method"></a> Model.delete (id)

Deletes a record from the database for provided `id` (idField).

Sample:


```
UserModel.delete(1)
```

### <a name="sanitize"></a>  Sanitization 

You can define `sanitize` function in constructor, to sanitize data before
executing the method (applies to all methods). Sanitize functions must be sync.

Sample:

```
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


## find/findAll Query Params

All params can be used for `find` or `findAll` method, and in `$where` 
for `upsert` method.


### Where params

Field level search:

1. **$in:** `{ id: { $in: [1,2] } }` - finds entries that have id 1 or 2
2. **$nin:** `{ id: { $nin: [1,2] } }` - finds entries that do not have id 1 or 2 
3. **$lt:** `{ id: { $lt: 5 } }` - finds entries that have id less than 5
4. **$lte:** `{ id: { $lte: 5 } }` - finds entries that have id less than or equal 5
5. **$gt:** `{ id: { $gt: 5 } }` - finds entries that have id greater than 5
6. **$gte:** `{ id: { $gte: 5 } }` - finds entries that have id greater than or equal 5
7. **$between:** `{ id: { $between: [1, 5] } }` - finds entries that have ids between 1 and 5 (including 1 and 5)
8. **$notBetween:** `{ id: { $notBetween: [1, 5] } }` - finds entries that do not have ids between 1 and 5 (excluding 1 and 5)
9. **$null** `{ id: { $null: true }}` - finds entries where id is null (use `$null: false` to invert the results)

### Or ($or)

Search for two or more params:

```
UserModel.find({ $or: { email: 'test@user.com', username: 'dan' } })
```

## Pagination

Pagination is done by utilizing `$limit` and `$skip`. By default, `$limit` is 
set to 10.

```
UserModel.find({ $limit: 50, $skip: 10 } })
```

## Sorting Data

Data can be sorted by one property, using `$sort`. Direction is optional and
defaults to `desc`.


```
UserModel.find({ $sort: { field: 'id', direction: 'asc' || 'desc' } } })
```



