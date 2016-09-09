const test = require('ava');
const {Handler} = require('../dist/index');

test('Handler.handle', async (t) => {
  let error = new Error();
  error.message = 'foo error';
  error.code = 404;

  let h = new Handler({
    handlers: {
      fooError: (e) => e.message === 'foo error',
      notFound: (e) => e.code === 404
    }
  });
  let result = await h.handle(
    '',
    {
      fooError: {
        message: 'is foo'
      },
      notFound: {
        message: 'not found'
      }
    }
  );

  t.deepEqual(result, ['is foo', 'not found']);
});

test('Handler.handle with onlyFirstError=true', async (t) => {
  let error = new Error();
  error.message = 'foo error';
  error.code = 404;

  let h = new Handler({
    firstErrorOnly: true,
    handlers: {
      fooError: (e) => e.message === 'foo error',
      notFound: (e) => e.code === 404
    }
  });
  let result = await h.handle(
    '',
    {
      fooError: {
        message: 'is foo'
      },
      notFound: {
        message: 'not found'
      }
    }
  );

  t.deepEqual(result, ['is foo']);
});

test('Handler.handle with custom errorBuilder', async (t) => {
  let error = new Error();
  error.message = 'foo error';
  error.code = 404;

  let h = new Handler({
    errorBuilder: (e, {message}) => ({message}),
    handlers: {
      fooError: (e) => e.message === 'foo error'
    }
  });
  let result = await h.handle(
    '',
    {
      fooError: {
        message: 'is foo'
      }
    }
  );

  t.deepEqual(result, [{message: 'is foo'}]);
});
