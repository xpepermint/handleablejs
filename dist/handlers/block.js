"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.block = block;
function block(error, recipe) {
  if (!error || !recipe) return false;

  if (recipe.block) {
    return recipe.block.call(this, { error: error, recipe: recipe });
  }
  return false;
}