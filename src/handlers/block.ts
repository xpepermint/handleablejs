export function block (error: Error, value: any, recipe: any): boolean | Promise<boolean> {
  if (!error || !recipe) return false;

  if (recipe.block) {
    return recipe.block.call(this, {error, value, recipe});
  }
  return false;
}
