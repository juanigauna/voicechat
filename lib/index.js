"use strict";

var _application = _interopRequireDefault(require("./application"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_application.default.start.catch(error => console.log(error));