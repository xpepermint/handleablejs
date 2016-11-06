import test from 'ava';
import {
  Handler,
  HandlerError
} from '../dist/index';

test('Handler.handle should return a list of HandlerError instances', async (t) => {
  let error = new Error('foo error');
  error.code = 404;

  let h = new Handler({
    handlers: {
      fooError (e) { return e.message === 'foo error' },
      notFound (e) { return e.code === 404 },
      doFound (e) { return e.code === 500 }
    }
  });
  let recipes = [
    {handler: 'fooError', message: 'is foo'},
    {handler: 'notFound', message: 'not found'},
    {handler: 'doFound', message: 'do found'},
  ];
  let errors = await h.handle(error, recipes);

  t.deepEqual(errors.length, 2);
  t.is(errors[0] instanceof HandlerError, true);
  t.is(errors[0].name, 'HandlerError');
  t.is(errors[0].handler, 'fooError');
  t.is(errors[0].message, 'is foo');
  t.is(errors[0].code, 422);
});

test('Handler.handle with onlyFirstError=true should return only one error', async (t) => {
  let error = new Error('foo error');
  error.code = 404;

  let h = new Handler({
    firstErrorOnly: true,
    handlers: {
      fooError (e) { return e.message === 'foo error' },
      notFound (e) { return e.code === 404 },
    }
  });
  let recipes = [
    {handler: 'fooError', message: 'is foo'},
    {handler: 'notFound', message: 'not found'}
  ];
  let errors = await h.handle(error, recipes);

  t.deepEqual(errors.length, 1);
});

test('HandlerError should not expose properties', async (t) => {
  let e = new HandlerError();
  t.deepEqual(Object.keys(e), []);
});

test('HandlerError.toObject should return error data', async (t) => {
  let e = new HandlerError('foo', 'bar');
  t.deepEqual(e.toObject(), {
    name: 'HandlerError',
    message: 'bar',
    handler: 'foo',
    code: 422
  });
});

test('recipe message can be a function', async (t) => {
  let error = new Error();
  error.message = 'foo error';

  let h = new Handler({
    handlers: {
      fooError (e) { return e.message === 'foo error' }
    }
  });
  let recipes = [
    {handler: 'fooError', message: () => 'is foo'}
  ];
  let errors = await h.handle(error, recipes);

  t.deepEqual(errors[0].message, 'is foo');
});

test('recipe message variables %{...} should be replaced with related recipe variables', async (t) => {
  let error = new Error();
  error.message = 'foo error';

  let h = new Handler({
    handlers: {
      fooError (e) { return e.message === 'foo error' }
    }
  });
  let recipes = [
    {handler: 'fooError', message: () => '%{foo} is required', foo: 'bar'}
  ];
  let errors = await h.handle(error, recipes);

  t.deepEqual(errors[0].message, 'bar is required');
});
