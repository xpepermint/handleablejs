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
class HandlerError extends Error {
    /*
    * Class constructor.
    */
    constructor(error = null, handler = null, message = null, code = 422) {
        super(message);
        this.name = this.constructor.name;
        this.error = error;
        this.handler = handler;
        this.message = message;
        this.code = code;
    }
}
exports.HandlerError = HandlerError;
/*
* A core error handling class.
*/
class Handler {
    /*
    * Class constructor.
    */
    constructor({ firstErrorOnly = false, handlers = {}, context = null } = {}) {
        this.firstErrorOnly = firstErrorOnly;
        this.handlers = Object.assign({}, builtInHandlers, handlers);
        this.context = context;
    }
    /*
    * Returns a new instance of HandlerError instance.
    */
    _createHandlerError(error, recipe) {
        let message = typeof recipe.message === 'function'
            ? recipe.message()
            : recipe.message;
        message = this._createString(message, recipe); // apply variables to a message
        return new HandlerError(error, recipe.handler, message);
    }
    /*
    * Replaces variables in a string (e.g. `%{variable}`) with object key values.
    */
    _createString(template, data) {
        for (let key in data) {
            template = template.replace(`%{${key}}`, data[key]);
        }
        return template;
    }
    /*
    * Validates the `error` against the `recipes`.
    */
    handle(error, value = null, recipes = []) {
        return __awaiter(this, void 0, void 0, function* () {
            let errors = [];
            for (let recipe of recipes) {
                let name = recipe.handler;
                let handler = this.handlers[name];
                if (!handler) {
                    throw new Error(`Unknown handler ${name}`);
                }
                let match = yield handler.call(this.context, error, value, recipe);
                if (match) {
                    errors.push(this._createHandlerError(error, recipe));
                    if (this.firstErrorOnly)
                        break;
                }
            }
            return errors;
        });
    }
}
exports.Handler = Handler;
