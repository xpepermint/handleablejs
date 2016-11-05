import * as builtInHandlers from './handlers';

/*
* Definition of the handler block method.
*/

export type HandlerBlock = (error: Error, value: any, recipe: any) => boolean | Promise<boolean>;

/*
* Definition of the recipe object for a handler.
*/

export interface RecipeObject {
  name: string; // handler name
  message: string | (() => string);
  [option: string]: any; // aditional properties
}

/*
* A reciped error class.
*/

export class HandledError extends Error {
  public recipe: RecipeObject;
  public error: Error;
  public value: any;
  public code: number;

  /*
  * Class constructor.
  */

  public constructor (
    recipe: RecipeObject, 
    error: Error = null, 
    value: any = null, 
    code: number = 422
  ) {
    let message = typeof recipe.message === 'function'
      ? recipe.message()
      : recipe.message;

    super(message);

    this.name = this.constructor.name;
    this.recipe = Object.assign({}, recipe, {message});
    this.error = error;
    this.value = value;
    this.code = code;
  }
}

/*
* A core error handling class.
*/

export class Handler {
  public firstErrorOnly: boolean;
  public handledError: typeof HandledError;
  public handlers: {[reciper: string]: HandlerBlock};
  public context: any;

  /*
  * Class constructor.
  */

  public constructor ({
    firstErrorOnly = false,
    handledError = HandledError,
    handlers = {},
    context = null
  }: {
    firstErrorOnly?: boolean,
    handledError?: typeof HandledError,
    handlers?: {[name: string]: HandlerBlock},
    context?: any
  } = {}) {
    this.firstErrorOnly = firstErrorOnly;
    this.handledError = handledError;
    this.handlers = Object.assign({}, builtInHandlers, handlers);
    this.context = context;
  }

  /*
  * Validates the `error` against the `recipes`.
  */

  public async handle(
    error: Error, 
    value: any = null, 
    recipes: RecipeObject[] = []
  ) {
    let errors = [];

    for (let recipe of recipes) {
      let {name} = recipe;

      let handler = this.handlers[name];
      if (!handler) {
        throw new Error(`Unknown handler ${name}`);
      }

      let match = await handler.call(this.context, error, value, recipe);
      if (match) {
        errors.push(
          new this.handledError(recipe, error, value)
        );

        if (this.firstErrorOnly) break;
      }
    }

    return errors;
  }
}
