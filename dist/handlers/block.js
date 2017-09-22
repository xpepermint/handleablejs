"use strict";
exports.__esModule = true;
function block(error, options) {
    if (options === void 0) { options = {}; }
    if (!error || !options)
        return false;
    var block = options.block;
    if (block) {
        return block.call(this, error, options);
    }
    return false;
}
exports.block = block;
