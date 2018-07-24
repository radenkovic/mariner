# SaltHash

SaltHash provides a safe way of storing passwords in the database, by hashing and salting them.
This way, database administrators and potential hackers will not be able to reconstruct the password
from the `salt` and `hash` stored in database. Module is based on [crypto](https://nodejs.org/api/crypto.html).

# Creating salt and hash

One should not store password as a string by no means. Instead, every password 
should be hashed and salted before storing. Additionally, every password should be salted with
new, completely random salt string (salt should not be reused across entities). Using `SaltHash` that is pretty straightforward:

`SaltHash` function expects one argument: `password`, and returns an object with `salt<string>`, `hash<string>`.

```
import { SaltHash } from 'node-mariner';

const { salt, hash } = saltHashPassword('userEnteredPassword');
// store salt and hash in database, eg.
// await User.create({ password, salt, name: 'Test User', email: 'sample@gmail.com' })
```


# Verifying password

To verify password, we provide password user entered, real user password and real user salt (from database)
we are comparing against to `verifyPassword`:

```

import { verifyPassword } from 'node-mariner';

const samplePassword = 'asdfasdf'

try {
  const user = await User.findOne({ email: 'sample@gmail.com' })
  verifyPassword({
    enteredPassword: samplePassword,
    password: user.password,
    salt: user.salt
  });
  // password is correct
} catch (e) {
  // password not correct
}
```

All keys are mandatory.

| key                | type     | description                                                                                   |
| -------------------|----------|-----------------------------------------------------------------------------------------------|
| enteredPassword    | `string` | password we are verifying against                                                             |
| password           | `string` | hashed password from database                                                                 |
| salt               | `string` | salt stored from database (note: every entity has own salt)                                   |


