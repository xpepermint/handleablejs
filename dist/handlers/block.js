"use strict";
function block(error, recipe) {
    if (!error || !recipe)
        return false;
    if (recipe.block) {
        return recipe.block.call(this, { error: error, recipe: recipe });
    }
    return false;
}
exports.block = block;
