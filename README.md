![Build Status](https://travis-ci.org/xpepermint/handleablejs.svg?branch=master)&nbsp;[![NPM Version](https://badge.fury.io/js/handleable.svg)](https://badge.fury.io/js/handleable)&nbsp;[![Dependency Status](https://gemnasium.com/xpepermint/handleablejs.svg)](https://gemnasium.com/xpepermint/handleablejs)

# handleable.js

> A library for synchronous and asynchronous error handling.

This is a light weight open source package, written with [TypeScript](https://www.typescriptlang.org), for use on **server or in browser**. The source code is available on [GitHub](https://github.com/xpepermint/handleablejs) where you can also find our [issue tracker](https://github.com/xpepermint/handleablejs/issues).

## Related Projects

* [Contextable.js](https://github.com/xpepermint/contextablejs): Simple, unopinionated and minimalist framework for creating context objects with support for unopinionated ORM, object schemas, type casting, validation and error handling and more.
* [ObjectSchema.js](https://github.com/xpepermint/objectschemajs): Advanced schema enforced JavaScript objects.
* [Validatable.js](https://github.com/xpepermint/validatablejs): A library for synchronous and asynchronous validation.
* [Typeable.js](https://github.com/xpepermint/typeablejs): A library for checking and casting types.

## Install

Run the command below to install the package.

```
$ npm install --save handleable
```

## Example

```js
import {Handler} from 'handleable';

let h = new Handler();

let e = await h.handle(
  new Error('unhandled error'), // error instance
  null, // optional error-related value which is caused the error
  [ // list of handler recipes
    {
      name: 'block', // handler name
      message: 'unhandled error', // handler error message
      block: async () => true // handler-specific property
    },
    {
      name: 'mongoUniqueness', // handler name
      message: 'already taken', // handler error message
      indexName: 'uniqueEmail' // handler-specific property
    }
  ]
); // -> a list of HandledError instances or an empty array
```

See the `./tests` folder for details.

## API

**HandledError(recipe, error, value, code)**

> Handled error class which holds information about the invalid value.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| recipe | Object | Yes | - | Handler recipe object.
| error | Error | No | null | Error instance (e.g. new Error())
| value | Any | No | null | Error-related value (e.g. value of a field).
| code | Integer | No | 422 | Error status code.

**Handler({firstErrorOnly, handledError, handlers, context})**

> A core validation class.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| firstErrorOnly | Boolean | No | false | When set to `true`, only the first error is handled otherwise all errors are returned.
| handledError | HandledError | No | HandledError | A custom HandledError class.
| handlers | Object | No | built-in handlers | Object with custom handlers (this variable is merged with built-in handlers thus you can override a handler if you need to).
| context | Object | No | null | A custom context reference which is applied to each handler.

```js
import {Handler, HandledError} from 'handleable';

let v = new Handler({
  firstErrorOnly: true,
  error: HandledError,
  handlers: {
    fooError ({error}) { return error.message === 'foo error' }, // custom handler
  },
  context: null
});
```

**Handler.prototype.handle(error, value, recipes)**: Boolean

> Handles an error against the provided recipes.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| error | Any | Yes | - | Error to validate.
| value | Any | No | null | Error-related value (e.g. value of a field).
| recipes | Array | No | [] | A configuration object describing handlers.

```js
let error = new Error();
let value = 'foo';
let recipes = [
  {
    name: 'block', // validator name
    message: 'is unknown error', // handler error message
    async block ({error, value, recipe}) { return true } // handler-specific property
  }
];
await h.handle(error, value, recipes);
```

### Built-in Handlers

#### block

> Checks if the provided block function succeeds.

| Option | Type | Required | Description
|--------|------|----------|------------
| block | Function,Promise | Yes | Synchronous or asynchronous function (e.g. `async () => true`).

```js
let recipe = {
  name: 'block',
  message: 'is unknown error',
  async block ({error, value, recipe}) { return true }
};
```

#### mongoUniqueness

> Checks if the error represents a MongoDB unique constraint error.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| indexName | String | Yes | - | MongoDB collection's unique index name.

```js
let recipe = {
  name: 'mongoUniqueness',
  message: 'is unknown error',
  indexName: 'uniqueEmail' // make sure that this index name exists in your MongoDB
};
```

## License (MIT)

```
Copyright (c) 2016 Kristijan Sedlak <xpepermint@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
