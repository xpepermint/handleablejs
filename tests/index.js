import test from 'ava';
import {Handler, HandlerError} from '../dist/index';

test.only('Handler.handle should return a list of HandlerError instances', async (t) => {
  let error = new Error();
  error.message = 'foo error';
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
  let errors = await h.handle(error, null, recipes);

  t.deepEqual(errors.length, 2);
  t.is(errors[0] instanceof HandlerError, true);
  t.is(errors[0].name, 'HandlerError');
  t.is(errors[0].handler, 'fooError');
  t.is(errors[0].message, 'is foo');
  t.is(errors[0].code, 422);
});

test('Handler.handle with onlyFirstError=true should return only one error', async (t) => {
  let error = new Error();
  error.message = 'foo error';
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
  let errors = await h.handle(null, null, recipes);

  t.deepEqual(errors.length, 1);
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
  let errors = await h.handle(null, null, recipes);

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
  let errors = await h.handle(null, null, recipes);

  t.deepEqual(errors[0].message, 'bar is required');
});
