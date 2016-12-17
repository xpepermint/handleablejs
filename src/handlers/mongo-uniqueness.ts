export interface Options {
  indexName?: string;
}

export function mongoUniqueness (error: any, options: Options = {}): boolean {
  if (!error || !options) return false;

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
    return options.indexName === index;
  }
  return false;
}
