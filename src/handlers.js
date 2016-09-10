export function mongoUniqueness(e, v, {indexName}={}) {
  var isError = (
    e
    && e.message
    && e.message.indexOf(`E11000 duplicate key error index:`) === 0
    && e.message.lastIndexOf(`dup key: { : "${v}" }`) !== -1
    && (
      typeof e.code === 'undefined'
      || e.code === 11000
    )
  );

  if (isError) {
    var index = e.message.split('$', 2)[1].split(' ', 2)[0];
    return indexName === index;
  } else {
    return false;
  }
}

export function blockInspect(e, v, definition={}) {
  return (
    !!e
    && !!definition
    && typeof definition.block === 'function'
    && definition.block.call(this, e, v, definition) === true
  );
}
