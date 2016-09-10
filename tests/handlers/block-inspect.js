const test = require('ava');
const {blockInspect} = require('../../dist/handlers');

test('fails when not matching error', (t) => {
  let error = new Error();

  t.is(blockInspect(), false);
  t.is(blockInspect('text'), false);
  t.is(blockInspect(error), false);
  t.is(blockInspect(error, null, {block: null}), false);
});

test('succeeds when matching error', (t) => {
  let error = new Error();
  error.code = 400;

  t.is(blockInspect(error, null, {
    block: (e) => e.code === 400
  }), true);
});
