"use strict";
function block(error, value, recipe) {
    if (!error || !recipe)
        return false;
    if (recipe.block) {
        return recipe.block.call(this, { error, value, recipe });
    }
    return false;
}
exports.block = block;
