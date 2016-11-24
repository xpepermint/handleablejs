'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Handler = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

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

      var errors, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, recipe, condition, result, name, handler, match;

      return _regenerator2.default.async(function handle$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              errors = [];
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context.prev = 4;
              _iterator = (0, _getIterator3.default)(recipes);

            case 6:
              if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                _context.next = 29;
                break;
              }

              recipe = _step.value;
              condition = recipe.condition;

              if (!condition) {
                _context.next = 15;
                break;
              }

              _context.next = 12;
              return _regenerator2.default.awrap(condition.call(this.context, error, recipe));

            case 12:
              result = _context.sent;

              if (result) {
                _context.next = 15;
                break;
              }

              return _context.abrupt('continue', 26);

            case 15:
              name = recipe.handler;
              handler = this.handlers[name];

              if (handler) {
                _context.next = 19;
                break;
              }

              throw new Error('Unknown handler ' + name);

            case 19:
              _context.next = 21;
              return _regenerator2.default.awrap(handler.call(this.context, error, recipe));

            case 21:
              match = _context.sent;

              if (!match) {
                _context.next = 26;
                break;
              }

              errors.push(this._createHandlerError(recipe));

              if (!this.firstErrorOnly) {
                _context.next = 26;
                break;
              }

              return _context.abrupt('break', 29);

            case 26:
              _iteratorNormalCompletion = true;
              _context.next = 6;
              break;

            case 29:
              _context.next = 35;
              break;

            case 31:
              _context.prev = 31;
              _context.t0 = _context['catch'](4);
              _didIteratorError = true;
              _iteratorError = _context.t0;

            case 35:
              _context.prev = 35;
              _context.prev = 36;

              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }

            case 38:
              _context.prev = 38;

              if (!_didIteratorError) {
                _context.next = 41;
                break;
              }

              throw _iteratorError;

            case 41:
              return _context.finish(38);

            case 42:
              return _context.finish(35);

            case 43:
              return _context.abrupt('return', errors);

            case 44:
            case 'end':
              return _context.stop();
          }
        }
      }, null, this, [[4, 31, 35, 43], [36,, 38, 42]]);
    }
  }]);
  return Handler;
}();