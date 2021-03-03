"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _server = _interopRequireDefault(require("./server"));

var _startup = _interopRequireDefault(require("./startup"));

var _env = _interopRequireDefault(require("../config/env"));

var _routes = _interopRequireDefault(require("./routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let server = new _server.default(_env.default, _routes.default);
let startup = new _startup.default(server);
var _default = {
  start: startup.start()
};
exports.default = _default;