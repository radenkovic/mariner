# Authenticate

Authenticate module provides simple authentication mechanism utilizing [json web tokens](https://jwt.io/).
While there are more robust solutions such as [Passport.js](http://www.passportjs.org/),
they are often too opinionated and bound to certain frameworks. Authenticate module provides clean
API to implement JWT authentication with minimal level of abstraction.

# Configuring Authenticate

Module is configured by passing configuration object with `secret` used for
signing tokens and optional `authorizationFn`:

```
import { Authenticate } from 'node-mariner'
const Auth = new Authenticate({
  secret: 'DEAD_SIMPLE_KEY',
  authorizationFn: () => { ... //  }
});
```

| key           | type          | description  |
| ------------- |-------------| -----|
| secret        | `string`      | Secret key  used for signing the token |
| authorizationFn (optional)        | `function`      |  function that checks if token should be issued, and returns payload*  for the token |

**NOTE**: `authorizationFn` can be sync or async function and it must resolve and return an payload `object` or to reject and throw an error.


# Issuing a token

We will configure Authenticate module to use `DEAD_SIMPLE_KEY` (in production use safe and unpredictable keys),
and a dummy `authorizationFn` that will return username if it's passed to function.

```
import { Authenticate } from 'node-mariner'
const Auth = new Authenticate({
  secret: 'DEAD_SIMPLE_KEY',
  authorizationFn: (username) => {
    if (!username) throw new Error('Please provide a username')
    return { username }
  }
});

```

We can now issue tokens as:

```
try {
  const payload = await Auth.authenticate('dan') // Auth.authenticate calls authorizationFn
  // payload will be { username: 'dan', access_token: '<SIGNED_JWT_TOKEN>'}
} catch (e) {
  console.log(e.message)
}
```

# Verifying a token

To verify the token, we use `verify` method from Authenticate module as following:


```
try {
  await Auth.verify('user provided username')
  // all good, user has access
} catch(e) {
  // token not valid
}
```

# Manually issuing a token (without `authorizationFn`)

If you do not provide `authorizationFn`, you need to sign your payload manually,
using `sign` method:

```
import { Authenticate } from 'node-mariner'

const Auth = new Authenticate({ secret: 'DEAD_SIMPLE_KEY' })

const manualAuthenticate = (username) => {
  if (!username) throw new Error('No username provided');
  const token = Auth.sign(username)
  // token is signed using `DEAD_SIMPLE_KEY` secret
  return token
}
```

# Real life sample using Mariner Service

You can preview complete implementation in [mariner-blog](https://docs.marinerjs.com/examples/blog) example. 





