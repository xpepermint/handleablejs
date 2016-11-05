"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const builtInHandlers = require('./handlers');
/*
* A reciped error class.
*/
class HandledError extends Error {
    /*
    * Class constructor.
    */
    constructor(recipe, error = null, value = null, code = 422) {
        let message = typeof recipe.message === 'function'
            ? recipe.message()
            : recipe.message;
        super(message);
        this.name = this.constructor.name;
        this.recipe = Object.assign({}, recipe, { message });
        this.error = error;
        this.value = value;
        this.code = code;
    }
}
exports.HandledError = HandledError;
/*
* A core error handling class.
*/
class Handler {
    /*
    * Class constructor.
    */
    constructor({ firstErrorOnly = false, handledError = HandledError, handlers = {}, context = null } = {}) {
        this.firstErrorOnly = firstErrorOnly;
        this.handledError = handledError;
        this.handlers = Object.assign({}, builtInHandlers, handlers);
        this.context = context;
    }
    /*
    * Validates the `error` against the `recipes`.
    */
    handle(error, value = null, recipes = []) {
        return __awaiter(this, void 0, void 0, function* () {
            let errors = [];
            for (let recipe of recipes) {
                let { name } = recipe;
                let handler = this.handlers[name];
                if (!handler) {
                    throw new Error(`Unknown handler ${name}`);
                }
                let match = yield handler.call(this.context, error, value, recipe);
                if (match) {
                    errors.push(new this.handledError(recipe, error, value));
                    if (this.firstErrorOnly)
                        break;
                }
            }
            return errors;
        });
    }
}
exports.Handler = Handler;
