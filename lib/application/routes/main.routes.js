"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _uuid = require("uuid");

var _default = () => {
  let router = (0, _express.Router)();
  router.get('/', (req, res) => {
    res.redirect(`room/${(0, _uuid.v4)()}`);
  });
  return router;
};

exports.default = _default;