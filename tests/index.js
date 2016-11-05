import test from 'ava';
import {Handler, HandlerError} from '../dist/index';

test.only('Handler.handle', async (t) => {
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
    {name: 'fooError', message: 'is foo'},
    {name: 'notFound', message: 'not found'},
    {name: 'doFound', message: 'do found'},
  ];
  let errors = await h.handle(error, null, recipes);

  t.deepEqual(errors.length, 2);
  t.is(errors[0] instanceof HandlerError, true);
  t.is(errors[0].name, 'HandlerError');
  t.is(errors[0].message, 'is foo');
  t.deepEqual(errors[0].recipe, recipes[0]);
  t.deepEqual(errors[1].recipe, recipes[1]);
  t.is(errors[0].code, 422);
});

test('Handler.handle with onlyFirstError=true', async (t) => {
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
    {name: 'fooError', message: 'is foo'},
    {name: 'notFound', message: 'not found'}
  ];
  let errors = await h.handle(null, null, recipes);

  t.deepEqual(errors.length, 1);
});

test('Handler.recipe with reciper message as a function', async (t) => {
  let error = new Error();
  error.message = 'foo error';

  let h = new Handler({
    handlers: {
      fooError (e) { return e.message === 'foo error' }
    }
  });
  let recipes = [
    {name: 'fooError', message: () => 'is foo'}
  ];
  let errors = await h.handle(null, null, recipes);

  t.deepEqual(errors[0].message, 'is foo');
});
