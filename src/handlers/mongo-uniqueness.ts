export interface Options {
  indexName?: string;
}

export function mongoUniqueness (error: any, options: Options = {}): boolean {
  if (!error || !options) return false;

  let matches = (
    !!error
    && !!error.message
    && error.message.indexOf(`E11000 duplicate`) === 0
    && (
      typeof error.code === 'undefined'
      || error.code === 11000
    )
  );

  if (matches) {
    const regex = /index\:\ (?:.*\.)?\$?(?:([_a-z0-9]*)(?:_\d*)|([_a-z0-9]*))\s*dup key/i;
    const match =  error.message.match(regex);
    return options.indexName === (match[1] || match[2]);
  } else {
    return false;
  }
}
