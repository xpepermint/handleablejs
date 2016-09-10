'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mongoUniqueness = mongoUniqueness;
exports.blockInspect = blockInspect;
function mongoUniqueness(e, v) {
  var _ref = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  let indexName = _ref.indexName;

  var isError = e && e.message && e.message.indexOf(`E11000 duplicate key error index:`) === 0 && e.message.lastIndexOf(`dup key: { : "${ v }" }`) !== -1 && (typeof e.code === 'undefined' || e.code === 11000);

  if (isError) {
    var index = e.message.split('$', 2)[1].split(' ', 2)[0];
    return indexName === index;
  } else {
    return false;
  }
}

function blockInspect(e, v) {
  let definition = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  return !!e && !!definition && typeof definition.block === 'function' && definition.block.call(this, e, v, definition) === true;
}