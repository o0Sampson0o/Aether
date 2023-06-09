"use strict";
const loginUrls = require("./endpoint/login/urls");
const signupUrls = require("./endpoint/signup/urls");
const { routeNode } = require("./utils/routeUtils.js");

const urls = [routeNode("api/", [...loginUrls, ...signupUrls])];

urls.reverse();

module.exports = urls;
