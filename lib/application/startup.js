"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class StartUp {
  constructor(server) {
    this.server = server;
  }

  async start() {
    await this.server.start();
  }

}

var _default = StartUp;
exports.default = _default;