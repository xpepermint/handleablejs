export function block (error, recipe) {
  if (!error || !recipe) return false;

  if (recipe.block) {
    return recipe.block.call(this, {error, recipe});
  }
  return false;
}
