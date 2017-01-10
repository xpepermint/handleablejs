export interface Options {
  block?: (error: any, options: any) => boolean | Promise<boolean>;
}

export function block (error: any, options: Options = {}): boolean {
  if (!error || !options) return false;

  let {block} = options;
  if (block) {
    return block.call(this, error, options);
  }
  return false;
}
