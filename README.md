![Build Status](https://travis-ci.org/xpepermint/handleablejs.svg?branch=master)&nbsp;[![NPM Version](https://badge.fury.io/js/handleable.svg)](https://badge.fury.io/js/handleable)&nbsp;[![Dependency Status](https://gemnasium.com/xpepermint/handleablejs.svg)](https://gemnasium.com/xpepermint/handleablejs)

# handleable.js

> A library for synchronous and asynchronous error handling.

## Related Projects

* [Contextable.js](https://github.com/xpepermint/contextablejs): Simple, unopinionated and minimalist framework for creating context objects with support for unopinionated ORM, object schemas, type casting, validation and error handling and more.
* [ObjectSchema.js](https://github.com/xpepermint/objectschemajs): Advanced schema enforced JavaScript objects.
* [Validatable.js](https://github.com/xpepermint/validatablejs): A library for synchronous and asynchronous validation.
* [Typeable.js](https://github.com/xpepermint/typeablejs): A library for checking and casting types.

## Install

```
$ npm install --save handleable
```

## Example

```js
import {Handler} from 'handleable';

let h = new Handler({
  firstErrorOnly: true,
  errorBuilder: async (error, value, definition) => ({message: definition.message}), // for custom error messages
  handlers: { // custom handlers (will be merged with built-in handlers; existing handlers can be overridden)
    unhandledError: async (error, value, definition) => eror.message === 'unhandled error'
  },
  context: null // context is applied to each handler
});

let errors = await h.handle(
  new Error('unhandled error'),
  null, // optional error-related value
  {
    unhandledError: { // custom handler name
      message: 'unhandled error' // error message (can be a function)
    },
    mongoUniqueness: { // built-in handler name
      indexName: 'uniqueEmail', // handler option
      message: 'already taken' // error message (can be a function)
    }
  }
); // -> [{message: 'unhandled error'}]
```

## API

**Handler(options)**

> A core validation class.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| firstErrorOnly | Boolean | No | false | When set to `true`, only the first error is handled otherwise all errors are returned.
| errorBuilder | Function/Promise | No | (error, {message}) => message | A method for constructing a custom error message.
| handlers | Object | No | built-in handlers | Object with custom handlers (this variable is merged with built-in handlers thus you can override a handler if you need to).
| context | Object | No | null | A custom context reference which is applied to each handler.

**Handler.prototype.handle(error, definitions):Boolean;**

> Validates an error against the provided definitions.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| error | Any | Yes | - | An error to validate.
| value | Any | No | - | An error-related value.
| definitions | Object | Yes | - | A configuration object describing handlers.

### Built-in Handlers

#### mongoUniqueness

> Checks if the error represents a MongoDB unique constraint error.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| indexName | String | Yes | - | MongoDB collection's unique index name.

#### blockInspect

> Checks if the provided block function succeeds.

| Option | Type | Required | Description
|--------|------|----------|------------
| block | Function | Yes | Synchronous or asynchronous function (e.g. `async () => true`).

```js
let definition = {
  block: async (error, value, definition) => true,
  message: 'is unknown error'
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
