'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Handler = undefined;
exports.defaultErrorBuilder = defaultErrorBuilder;

var _handlers = require('./handlers');

var defaultHandlers = _interopRequireWildcard(_handlers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function defaultErrorBuilder(error, value, definition) {
  let message = definition.message;

  let isString = typeof message === 'string';
  return isString ? message : message.call(this, error, value, definition);
}

class Handler {

  constructor() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$firstErrorOnly = _ref.firstErrorOnly;
    let firstErrorOnly = _ref$firstErrorOnly === undefined ? false : _ref$firstErrorOnly;
    var _ref$errorBuilder = _ref.errorBuilder;
    let errorBuilder = _ref$errorBuilder === undefined ? defaultErrorBuilder : _ref$errorBuilder;
    var _ref$handlers = _ref.handlers;
    let handlers = _ref$handlers === undefined ? {} : _ref$handlers;
    var _ref$context = _ref.context;
    let context = _ref$context === undefined ? null : _ref$context;

    this.firstErrorOnly = firstErrorOnly;
    this.errorBuilder = errorBuilder;
    this.handlers = Object.assign(handlers, defaultHandlers);
    this.context = context;
  }

  handle(error) {
    var _arguments = arguments,
        _this = this;

    return _asyncToGenerator(function* () {
      let value = _arguments.length <= 1 || _arguments[1] === undefined ? null : _arguments[1];
      let definitions = _arguments.length <= 2 || _arguments[2] === undefined ? {} : _arguments[2];

      let errors = [];

      for (let name in definitions) {
        let definition = definitions[name];

        let handler = _this.handlers[name];
        if (!handler) {
          throw new Error(`Unknown handler ${ name }`);
        }

        let match = yield handler.call(_this.context, error, value, definition);
        if (match) {
          errors.push((yield _this.errorBuilder.call(_this.context, error, value, definition)));

          if (_this.firstErrorOnly) break;
        }
      }

      return errors;
    })();
  }
}
exports.Handler = Handler;