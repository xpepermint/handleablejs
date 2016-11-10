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

To support browsers `>= IE9` you need to
* use the [preset-es2015](https://babeljs.io/docs/plugins/preset-es2015/) preset,
* include [Babel polyfill](https://babeljs.io/docs/usage/polyfill),
* use plugins [syntax-async-functions](https://babeljs.io/docs/plugins/syntax-async-functions),  [transform-regenerator](https://babeljs.io/docs/plugins/transform-regenerator/) and [transform-object-assign](https://www.npmjs.com/package/babel-plugin-transform-object-assign).

## Example

```js
import {Handler} from 'handleable';

let h = new Handler();

let e = await h.handle(
  new Error('unhandled error'), // error instance
  [ // list of handler recipes
    {
      handler: 'block', // handler name
      message: '%{foo} unhandled error', // handler error message
      block: async () => true // handler-specific property,
      foo: 'bar' // custom variable for the message
    },
    {
      handler: 'mongoUniqueness', // handler name
      message: 'already taken', // handler error message
      indexName: 'uniqueEmail' // handler-specific property
    }
  ]
); // -> a list of errors
```

See the `./tests` folder for details.

## API

**Handler({firstErrorOnly, handlers, context})**

> A core validation class.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| firstErrorOnly | Boolean | No | false | When set to `true`, only the first error is handled otherwise all errors are returned.
| handlers | Object | No | built-in handlers | Object with custom handlers (this variable is merged with built-in handlers thus you can override a handler if you need to).
| context | Object | No | null | A custom context reference which is applied to each handler.

```js
import {Handler} from 'handleable';

let v = new Handler({
  firstErrorOnly: true,
  handlers: {
    fooError ({error}) { return error.message === 'foo error' }, // custom handler
  },
  context: null
});
```

**Handler.prototype.handle(error, recipes)**: Promise(Object[])

> Handles an error against the provided recipes.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| error | Any | Yes | - | Error to validate.
| recipes | Array | No | [] | A configuration object describing handlers.

```js
let error = new Error();
let recipe = {
  handler: 'block', // [required] handler name
  message: '%{foo} is unknown error', // [required] handler error message (note that you can insert related recipe values by using the %{key} syntax)
  async block ({error, recipe}) { return true } // [handler specific] handler-specific property
  foo: 'bar' // [optional] a custom variable
};
let recipes = [recipe];
await h.handle(error, recipes);
```

### Built-in Handlers

#### block

> Checks if the provided block function succeeds.

| Option | Type | Required | Description
|--------|------|----------|------------
| block | Function,Promise | Yes | Synchronous or asynchronous function (e.g. `async () => true`).

```js
let recipe = {
  handler: 'block',
  message: 'is unknown error',
  async block ({error, recipe}) { return true }
};
```

#### mongoUniqueness

> Checks if the error represents a MongoDB unique constraint error.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| indexName | String | Yes | - | MongoDB collection's unique index name.

```js
let recipe = {
  handler: 'mongoUniqueness',
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
