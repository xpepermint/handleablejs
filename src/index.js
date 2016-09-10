import * as defaultHandlers from './handlers';

export function defaultErrorBuilder(error, definition) {
  let {message} = definition;
  let isString = typeof message === 'string';
  return isString ? message : message.call(this, error, definition);
}

export class Handler {

  constructor({
    firstErrorOnly=false,
    errorBuilder=defaultErrorBuilder,
    handlers={},
    context=null
  }={}) {
    this.firstErrorOnly = firstErrorOnly;
    this.errorBuilder = errorBuilder;
    this.handlers = Object.assign(handlers, defaultHandlers);
    this.context = context;
  }

  async handle(error, definitions={}) {
    let errors = [];

    for (let name in definitions) {
      let definition = definitions[name];

      let handler = this.handlers[name];
      if (!handler) {
        throw new Error(`Unknown handler ${name}`);
      }

      let match = await handler.call(this.context, error, definition);
      if (match) {
        errors.push(
          await this.errorBuilder.call(this.context, error, definition)
        );

        if (this.firstErrorOnly) break;
      }
    }

    return errors;
  }
}
