"use strict";

const { routeNode } = require("../../utils/routeUtils.js");
const  { signup, activate } = require("./controller.js");

const urls = [
    routeNode("signup/activate/<str sessionId>", activate),
    routeNode("signup", signup),
];

urls.reverse();

module.exports = urls;