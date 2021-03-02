"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  PORT: process.env.PORT,
  PEER_CONFIG: {
    secure: true,
    host: 'peer-server-noname.herokuapp.com',
    port: 443,
    path: '/server'
  }
};
exports.default = _default;