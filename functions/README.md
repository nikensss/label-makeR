# A primer in firebase functions config

Firebase offers the option to keep configuration values on the project without
adding them in the codebase. For that, we need to use the following command:

```bash
firebase functions:config:set name="value"
```

The `name` can have dots to group variables together (like normal JSON). To
read the current config in a project, we first need to set the firebase CLI to
use that project and then get it:

```bash
firebase use project-name
firebase functions:config:get | json_pp
```

If you don't have the firebase CLI installed, install it with:

```bash
npm i -g firebase-tools
```

To set those variables for the emulators, add a `.runtimeconfig.json` file at
the same level as the `package.json` and type in a JSON object.

These variables are accessible in the code by doing the following (but this is
NOT how we are going to do it in this project)

```typescript
import * as functions from 'firebase-functions';

const config = functions.config();
```

To read more about it, follow [this](https://firebase.google.com/docs/functions/config-env) link.

# The config for this project

It is necessary to include the following data in the config:

```json
{
  "stripe": {
    "api_key": "A string with they API key for stripe",
    "success_url": "The URL for the 'success_url' parameter of Stripe",
    "cancel_url": "The URL for the 'cancel_url' parameter for Stripe"
  },
  "env": {
    "is_dev": "A boolean indicating if we are in development or not."
  }
}
```

## DO NOT ACCESS IT DIRECTLY

We have a wrapper for the firebase config to prevent potential mistakes. It
includes default values, and it (should) appropriately convert boolean values
to boolean types (everything is a string in the firebase config).

## `env` section

By default, we should consider the `env` to be `production`. So in case it is
not specified, we use the safe approaches (like proper logging, no debugging
returns...)
