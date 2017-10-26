"use strict";
exports.__esModule = true;
function mongoUniqueness(error, options) {
    if (options === void 0) { options = {}; }
    if (!error || !options)
        return false;
    var matches = (!!error
        && !!error.message
        && error.message.indexOf("E11000 duplicate") === 0
        && (typeof error.code === 'undefined'
            || error.code === 11000));
    if (matches) {
        var regex = /index\:\ (?:.*\.)?\$?(?:([_a-z0-9]*)(?:_\d*)|([_a-z0-9]*))\s*dup key/i;
        var match = error.message.match(regex);
        return options.indexName === (match[1] || match[2]);
    }
    else {
        return false;
    }
}
exports.mongoUniqueness = mongoUniqueness;
