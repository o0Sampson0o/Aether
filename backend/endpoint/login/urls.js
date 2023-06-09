"use strict";

const { routeNode } = require("../../utils/routeUtils.js");
const  { login, loginWithSession } = require("./controller.js");

const urls = [
    routeNode("login/session/<str sessionId>/<str userId>", loginWithSession),
    routeNode("login", login),

];

urls.reverse();

module.exports = urls;