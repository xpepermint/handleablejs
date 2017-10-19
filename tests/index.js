import test from 'ava';
import {Handler} from '../dist/index';

test('method `handle` should return a list of errors', async (t) => {
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
  t.is(errors[0].handler, 'fooError');
  t.is(errors[0].message, 'is foo');
  t.is(errors[0].code, 422);
});

test('method `handle` with onlyFirstError=true should return only one error', async (t) => {
  let error = new Error('foo error');
  error.code = 404;

  let h = new Handler({
    failFast: true,
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

test('recipe `message` can be a function', async (t) => {
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

test('recipe `message` variables %{...} should be replaced with related recipe variables', async (t) => {
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

test('recipe `message` can be empty or absent', async (t) => {
  let error = new Error();
  error.message = 'foo error';

  let h = new Handler({
    handlers: {
      fooError (e) { return e.message === 'foo error' }
    }
  });
  let recipes = [
    {handler: 'fooError', message: null},
    {handler: 'fooError', message: undefined},
    {handler: 'fooError'}
  ];
  let errors = await h.handle(error, recipes);

  t.deepEqual(errors[0].message, null);
  t.deepEqual(errors[1].message, undefined);
  t.deepEqual(errors[2].message, undefined);
});




test('recipe `condition` key can switch off the handling', async (t) => {
  let error = new Error();
  error.message = 'foo error';

  let h = new Handler({
    handlers: {
      fooError (e) { return e.message === 'foo error' }
    }
  });
  let recipes = [
    {handler: 'fooError', message: () => 'is foo', condition: () => true},
    {handler: 'fooError', message: () => 'is foo', condition: () => false},
    {handler: 'fooError', message: () => 'is foo'}
  ];
  let errors = await h.handle(error, recipes);

  t.deepEqual(errors.length, 2);
});
