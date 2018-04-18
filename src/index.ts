import merge = require('lodash.merge');
import * as builtInHandlers from './handlers';

/*
* Recipe type definition.
*/

export interface HandlerRecipe {
  handler: string;
  message?: string | (() => string);
  code?: number;
  condition?: () => boolean | Promise<boolean>;
  [key: string]: any;
}

/*
* Error type definition.
*/

export interface HandlerError {
  handler: string;
  message: string;
  code: number;
}

/*
* A core error handling class.
*/

export class Handler {
  failFast: boolean;
  handlers: {[name: string]: () => boolean | Promise<boolean>};
  context: any;

  /*
  * Class constructor.
  */

  constructor ({
    failFast = false,
    handlers = {},
    context = null
  }: {
    failFast?: boolean,
    handlers?: {[name: string]: () => boolean | Promise<boolean>},
    context?: any
  } = {}) {
    this.failFast = failFast;
    this.handlers = merge(builtInHandlers, handlers);
    this.context = context;
  }

  /*
  * Returns a new instance of HandlerError instance.
  */

  _createHandlerError (recipe: HandlerRecipe): HandlerError {
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

  _createString (template: string, data: any): string {
    if (!template) {
      return template;
    }

    for (let key in data) {
      template = template.replace(`%{${key}}`, data[key]);
    }

    return template;
  }

  /*
  * Validates the `error` against the `recipes`.
  */

  async handle (error: Error, recipes: HandlerRecipe[] = []): Promise<HandlerError[]> {
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

        if (this.failFast) break;
      }
    }

    return errors;
  }
}
