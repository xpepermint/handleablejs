import * as builtInHandlers from './handlers';

/*
* A core error handling class.
*/

export class Handler {

  /*
  * Class constructor.
  */

  constructor ({firstErrorOnly = false, handlers = {}, context = null} = {}) {
    this.firstErrorOnly = firstErrorOnly;
    this.handlers = Object.assign({}, builtInHandlers, handlers);
    this.context = context;
  }

  /*
  * Returns a new instance of HandlerError instance.
  */

  _createHandlerError (recipe) {
    let {handler, code = 422} = recipe;

    let message = typeof recipe.message === 'function'
      ? recipe.message()
      : recipe.message;
    message = this._createString(message, recipe); // apply variables to a message

    return {handler, message, code};
  }

  /*
  * Replaces variables in a string (e.g. `%{variable}`) with object key values.
  */

  _createString (template, data) {
    for (let key in data) {
      template = template.replace(`%{${key}}`, data[key]);
    }
    return template;
  }

  /*
  * Validates the `error` against the `recipes`.
  */

  async handle (error, recipes = []) {
    let errors = [];

    for (let recipe of recipes) {
      let condition = recipe.condition;
      if (condition) {
        let result = await condition.call(this.context, error, recipe);
        if (!result) continue;
      }

      let name = recipe.handler;
      let handler = this.handlers[name];
      if (!handler) {
        throw new Error(`Unknown handler ${name}`);
      }

      let match = await handler.call(this.context, error, recipe);
      if (match) {
        errors.push(
          this._createHandlerError(recipe)
        );

        if (this.firstErrorOnly) break;
      }
    }

    return errors;
  }
}
