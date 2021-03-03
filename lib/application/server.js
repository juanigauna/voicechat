"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _http = _interopRequireDefault(require("http"));

var _socket = _interopRequireDefault(require("socket.io"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Server {
  constructor(config, router) {
    this.config = config;
    this.app = (0, _express.default)();
    this.server = _http.default.Server(this.app);
    this.io = (0, _socket.default)(this.server);
    this.app.use(_express.default.static('public'));
    this.app.set('view engine', 'ejs');
    this.app.use(router());
    this.io.on('connection', socket => {
      socket.on('join', data => {
        let {
          roomId,
          userId
        } = data;
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', {
          userId: userId
        });
        socket.on('disconnect', () => {
          socket.to(roomId).emit('user-disconnected', {
            userId: userId
          });
        });
      });
    });
  }

  start() {
    return new Promise((resolve, reject) => {
      this.server.listen(this.config.PORT, () => {
        console.log('Server running on port', this.config.PORT);
        resolve();
      });
    });
  }

}

var _default = Server;
exports.default = _default;