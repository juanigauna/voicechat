"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = socket => {
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
};

exports.default = _default;