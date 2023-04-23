'use strict';
var truncate = require("./truncate");
var getLength = Buffer.byteLength.bind(Buffer);
module.exports = truncate.bind(null, getLength);