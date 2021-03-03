"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  PORT: process.env.PORT,
  PEER_CONFIG: {
    host: 'localhost',
    port: 3001,
    path: '/server',
    debug: 3
  }
};
exports.default = _default;