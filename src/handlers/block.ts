export function block (error: Error, recipe?: any): boolean | Promise<boolean> {
  if (!error || !recipe) return false;

  if (recipe.block) {
    return recipe.block.call(this, {error, recipe});
  }
  return false;
}
