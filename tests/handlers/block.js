import test from 'ava';
import {block} from '../../dist/handlers';

test('fails when not matching error', async (t) => {
  let error = new Error();

  t.is(block(), false);
  t.is(block('text'), false);
  t.is(block(error), false);
  t.is(block(error, {block: null}), false);
});

test('succeeds when matching error', async (t) => {
  let error = new Error();
  error.code = 400;

  t.is(block(error, {
    block (error) { return error.code === 400 }
  }), true);
  t.is(await block(error, {
    async block (error) { return error.code === 400 }
  }), true);
});
