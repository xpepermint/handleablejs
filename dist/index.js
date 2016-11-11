'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Handler = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _handlers = require('./handlers');

var builtInHandlers = _interopRequireWildcard(_handlers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* A core error handling class.
*/

var Handler = exports.Handler = function () {

  /*
  * Class constructor.
  */

  function Handler() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$firstErrorOnly = _ref.firstErrorOnly,
        firstErrorOnly = _ref$firstErrorOnly === undefined ? false : _ref$firstErrorOnly,
        _ref$handlers = _ref.handlers,
        handlers = _ref$handlers === undefined ? {} : _ref$handlers,
        _ref$context = _ref.context,
        context = _ref$context === undefined ? null : _ref$context;

    (0, _classCallCheck3.default)(this, Handler);

    this.firstErrorOnly = firstErrorOnly;
    this.handlers = (0, _extends3.default)({}, builtInHandlers, handlers);
    this.context = context;
  }

  /*
  * Returns a new instance of HandlerError instance.
  */

  (0, _createClass3.default)(Handler, [{
    key: '_createHandlerError',
    value: function _createHandlerError(recipe) {
      var handler = recipe.handler,
          _recipe$code = recipe.code,
          code = _recipe$code === undefined ? 422 : _recipe$code;


      var message = typeof recipe.message === 'function' ? recipe.message() : recipe.message;
      message = this._createString(message, recipe); // apply variables to a message

      return { handler: handler, message: message, code: code };
    }

    /*
    * Replaces variables in a string (e.g. `%{variable}`) with object key values.
    */

  }, {
    key: '_createString',
    value: function _createString(template, data) {
      for (var key in data) {
        template = template.replace('%{' + key + '}', data[key]);
      }
      return template;
    }

    /*
    * Validates the `error` against the `recipes`.
    */

  }, {
    key: 'handle',
    value: function handle(error) {
      var recipes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      var errors, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, recipe, name, handler, match;

      return _regenerator2.default.async(function handle$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              errors = [];
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context.prev = 4;
              _iterator = recipes[Symbol.iterator]();

            case 6:
              if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                _context.next = 22;
                break;
              }

              recipe = _step.value;
              name = recipe.handler;
              handler = this.handlers[name];

              if (handler) {
                _context.next = 12;
                break;
              }

              throw new Error('Unknown handler ' + name);

            case 12:
              _context.next = 14;
              return _regenerator2.default.awrap(handler.call(this.context, error, recipe));

            case 14:
              match = _context.sent;

              if (!match) {
                _context.next = 19;
                break;
              }

              errors.push(this._createHandlerError(recipe));

              if (!this.firstErrorOnly) {
                _context.next = 19;
                break;
              }

              return _context.abrupt('break', 22);

            case 19:
              _iteratorNormalCompletion = true;
              _context.next = 6;
              break;

            case 22:
              _context.next = 28;
              break;

            case 24:
              _context.prev = 24;
              _context.t0 = _context['catch'](4);
              _didIteratorError = true;
              _iteratorError = _context.t0;

            case 28:
              _context.prev = 28;
              _context.prev = 29;

              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }

            case 31:
              _context.prev = 31;

              if (!_didIteratorError) {
                _context.next = 34;
                break;
              }

              throw _iteratorError;

            case 34:
              return _context.finish(31);

            case 35:
              return _context.finish(28);

            case 36:
              return _context.abrupt('return', errors);

            case 37:
            case 'end':
              return _context.stop();
          }
        }
      }, null, this, [[4, 24, 28, 36], [29,, 31, 35]]);
    }
  }]);
  return Handler;
}();