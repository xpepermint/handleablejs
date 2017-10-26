import test from 'ava';
import {mongoUniqueness} from '../../dist/handlers';

test('fails when not matching error', (t) => {
  let error = new Error();

  t.is(mongoUniqueness('text'), false);
  t.is(mongoUniqueness(error), false);
});

test('succeeds when matching error', (t) => {
  let error0 = { message: 'E11000 duplicate key error index: test.users.$uniqueEmail dup key: { : \"me@domain.com\" }' };
  let error1 = { message: 'E11000 duplicate key error collection: db.users index: name_1 dup key: { : "Kate" }' };
  let error2 = { message: 'E11000 duplicate key error index: myDb.myCollection.$id dup key: { : ObjectId(\'57226808ec55240c00000272\') }' };
  let error3 = { message: 'E11000 duplicate key error index: test.collection.$a.b_1 dup key: { : null }' };
  let error4 = { message: 'E11000 duplicate key error collection: upsert_bug.col index: _id_ dup key: { : 3.0 }' };

  t.is(mongoUniqueness(error0, {indexName: 'uniqueEmail'}), true);
  t.is(mongoUniqueness(error1, {indexName: 'name'}), true);
  t.is(mongoUniqueness(error2, {indexName: 'id'}), true);
  t.is(mongoUniqueness(error3, {indexName: 'b'}), true);
  t.is(mongoUniqueness(error4, {indexName: '_id'}), true);
});
