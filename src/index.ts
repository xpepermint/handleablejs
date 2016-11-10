import * as builtInHandlers from './handlers';

/*
* Definition of the handler block method.
*/

export type HandlerBlock = (error: Error, value: any, recipe: any) => boolean | Promise<boolean>;

/*
* Definition of the recipe object for a handler.
*/

export interface RecipeObject {
  handler: string; // handler name
  message: string | (() => string);
  [option: string]: any; // aditional properties
}

/*
* Definition of an error object.
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
  public firstErrorOnly: boolean;
  public handlers: {[reciper: string]: HandlerBlock};
  public context: any;

  /*
  * Class constructor.
  */

  public constructor ({
    firstErrorOnly = false,
    handlers = {},
    context = null
  }: {
    firstErrorOnly?: boolean,
    handlers?: {[name: string]: HandlerBlock},
    context?: any
  } = {}) {
    this.firstErrorOnly = firstErrorOnly;
    this.handlers = Object.assign({}, builtInHandlers, handlers);
    this.context = context;
  }

  /*
  * Returns a new instance of HandlerError instance.
  */

  protected _createHandlerError (recipe: RecipeObject): HandlerError {
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

  protected _createString (template, data): string {
    for (let key in data) {
      template = template.replace(`%{${key}}`, data[key]);
    }
    return template;
  }

  /*
  * Validates the `error` against the `recipes`.
  */

  public async handle(
    error: Error,
    recipes: RecipeObject[] = []
  ) {
    let errors = [];

    for (let recipe of recipes) {
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
