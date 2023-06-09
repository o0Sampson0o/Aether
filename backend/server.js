"use strict";

require("./sqlConnection").connect();

// ----------------------------------------        utils       ----------------------------------------
const httpUtils = require("http");
const urlUtils = require("url");
const { serve404Page } = require("./utils/fileUtils");
const { LOG, MODE } = require("./logger");
const { parseToRoute, navigateFrom } = require("./utils/routeUtils");

// ----------------------------------------   global constant  ----------------------------------------
const { allowedOrigin } = require("./globalConstant/cors");

const routeHeadNode = require("./urls");
const navigate = navigateFrom(routeHeadNode);

const PORT = 8080;

const httpServer = httpUtils.createServer(reqHandler);

function reqHandler(req, res) {
	// TODO: RETHINK ABOUT CORS;

	let reqOrigin = req.headers.origin;
	reqOrigin = reqOrigin?.at(-1) === "/" ? reqOrigin.slice(0, -1) : reqOrigin;
	const origin = allowedOrigin?.find((x) => x === reqOrigin);

	res.setHeader("Access-Control-Allow-Origin", origin ? req.headers.origin : "");
	res.setHeader("Access-Control-Allow-Credentials", true);

	if (req.method === "OPTIONS") {
		res.setHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
		res.setHeader("Access-Control-Request-Method", "*");
		res.setHeader("Access-Control-Allow-Headers", "Content-Type");
		res.writeHead(200);
		res.end();
		return;
	}

	const reqUrl = urlUtils.parse(req.url, true);
	const httpQuery = reqUrl.query;

	const route = parseToRoute(reqUrl.pathname);
	if (route.length > 1) {
		route.shift();
	}

	const isExecuteSuccess = navigate(route, { httpQuery, httpReq: req, httpRes: res });

	if (!isExecuteSuccess) {
		serve404Page(res);
	}
}

httpServer.listen(PORT, "localhost", () => {
	LOG(MODE.msg, `Server Running at http://localhost:${PORT}`);
});