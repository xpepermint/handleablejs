export function mongoUniqueness (error, recipe) {
  if (!error || !recipe) return false;

  let matches = (
    error
    && error.message
    && error.message.indexOf(`E11000 duplicate key error index:`) === 0
    && (
      typeof error.code === 'undefined'
      || error.code === 11000
    )
  );

  if (matches) {
    var index = error.message.split('$', 2)[1].split(' ', 2)[0];
    return recipe.indexName === index;
  }
  return false;
}
