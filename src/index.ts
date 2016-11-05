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
  public error: Error;
  public value: any;
  public recipe: RecipeObject;
  public code: number;

  /*
  * Class constructor.
  */

  public constructor (
    error: Error = null, 
    value: any = null, 
    recipe: RecipeObject = null, 
    code: number = 422
  ) {
    super();

    this.message = typeof recipe.message === 'function'
      ? recipe.message()
      : recipe.message;

    this.name = this.constructor.name;
    this.error = error;
    this.value = value;
    this.recipe = Object.assign({}, recipe, {message: this.message});
    this.code = code;
  }
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
  * Returns a new instance of HandledError instance.
  */

  public createHandledError (error: Error, value: any, recipe: RecipeObject): HandledError {
    return new HandledError(error, value, recipe);
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
          this.createHandledError(error, value, recipe)
        );

        if (this.firstErrorOnly) break;
      }
    }

    return errors;
  }
}
