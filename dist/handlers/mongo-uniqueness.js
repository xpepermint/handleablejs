"use strict";
exports.__esModule = true;
function mongoUniqueness(error, options) {
    if (options === void 0) { options = {}; }
    if (!error || !options)
        return false;
    var matches = (error
        && error.message
        && error.message.indexOf("E11000 duplicate key error index:") === 0
        && (typeof error.code === 'undefined'
            || error.code === 11000));
    if (matches) {
        var index = error.message.split('$', 2)[1].split(' ', 2)[0];
        return options.indexName === index;
    }
    return false;
}
exports.mongoUniqueness = mongoUniqueness;
