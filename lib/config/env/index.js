"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("dotenv/config");

var _development = _interopRequireDefault(require("./development"));

var _production = _interopRequireDefault(require("./production"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  NODE_ENV
} = process.env;
const CURRENT_ENV = NODE_ENV === 'production' ? _production.default : _development.default;
var _default = CURRENT_ENV;
exports.default = _default;