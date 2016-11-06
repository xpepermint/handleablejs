import test from 'ava';
import {mongoUniqueness} from '../../dist/handlers';

test('fails when not matching error', (t) => {
  let error = new Error();

  t.is(mongoUniqueness('text'), false);
  t.is(mongoUniqueness(error), false);
});

test('succeeds when matching error', (t) => {
  let error = new Error();
  error.message = 'E11000 duplicate key error index: test.users.$uniqueEmail dup key: { : \"me@domain.com\" }';

  t.is(mongoUniqueness(error, {indexName: 'uniqueEmail'}), true);
});
