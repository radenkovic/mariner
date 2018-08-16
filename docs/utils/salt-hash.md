# SaltHash

SaltHash provides a safe way of storing passwords in the database, by hashing and salting them.
This way, database administrators and potential hackers will not be able to reconstruct the password
from the `salt` and `hash` stored in database. Module is based on [bcrypt](https://github.com/kelektiv/node.bcrypt.js).

# Creating salt and hash

One should not store password as a string by no means. Instead, every password 
should be hashed and salted before storing. Additionally, every password should be salted with
new, completely random salt string (salt should not be reused across entities). Using `SaltHash` that is pretty straightforward:

`SaltHash` function expects one argument: `password`, and returns a `hash<string>`. Please note that hash includes the salt,
so there's no need to store `salt` separately. For more information check [bcrypt](https://github.com/kelektiv/node.bcrypt.js).


You can specify salt length as second argument in SaltHash function, default is 9, for optimal performance and security.
Increasing the number will make hash harder to exploit, but speed of creating hash dramatically falls.


```
import { SaltHash } from 'node-mariner';

const password = SaltHash('userEnteredPassword', 9); // second argument is optional (salt length) defaults to 8
// store the hash in database, eg.
// await User.create({ password, name: 'Test User', email: 'sample@gmail.com' })
```


# Verifying password

To verify password, we provide password user entered, real user password and real user salt (from database)
we are comparing against to `verifyPassword`:

```

import { verifyPassword } from 'node-mariner';

try {
  const user = await User.findOne({ email: 'sample@gmail.com' })
  verifyPassword({
    enteredPassword: 'asdfasdf',
    password: user.password,
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


