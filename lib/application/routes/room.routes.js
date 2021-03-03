"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _env = _interopRequireDefault(require("../../config/env"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = () => {
  let router = (0, _express.Router)();
  router.get('/:roomId', (req, res) => {
    res.render('room', {
      roomId: req.params.roomId,
      config: _env.default.PEER_CONFIG
    });
  });
  return router;
};

exports.default = _default;