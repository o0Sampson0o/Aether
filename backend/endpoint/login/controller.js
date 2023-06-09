"use strict";

// ----------------------------------------    dependencies    ----------------------------------------
const bcrypt = require("bcrypt");
const Aether = require("../../globalConstant/database");
const sqlConnection = require("../../sqlConnection").getConnection();
const { LOG, MODE } = require("../../logger.js");

// ----------------------------------------        utils       ----------------------------------------
const { readRequestBody } = require("../../utils/httpUtils");
const { sqlEscape } = require("../../utils/sqlUtils");

// ----------------------------------------   global variable  ----------------------------------------
const { loginSession } = require("../../globalVariable/session.js");

function login({ httpReq, httpRes }) {
	const result = {
		error: false
	};

	readRequestBody(httpReq).then((body) => {
		const email = sqlEscape(body.email);
		const password = body.password;
		const sql = `SELECT email, hashedPassword, userId FROM ${Aether.userAcc} WHERE email='${email}'`;

		sqlConnection.query(sql, (sqlErr, sqlResult) => {
			if (sqlErr) {
				throw sqlErr;
			}
			if (sqlResult.length !== 0) {
				bcrypt
					.compare(password, sqlResult[0].hashedPassword)
					.then((bcryptResult) => {
						if (!bcryptResult) {
							result.error = true;
							return;
						}

						const session = loginSession.create(+sqlResult[0].userId);

						httpRes.setHeader("Set-Cookie", [
							`userId=${sqlResult[0].userId}; path=/; expires=${new Date(
								session.expireDate + loginSession.DEFAULT_PADDING
							).toUTCString()};`,
							`sessionId=${session.sessionId}; path=/; expires=${new Date(
								session.expireDate + loginSession.DEFAULT_PADDING
							).toUTCString()};`
						]);
						httpRes.writeHead(200, { "Content-Type": "application/json" });
						httpRes.write(JSON.stringify(result));
						httpRes.end();
					})
					.catch(console.log);
			} else {
				result.error = true;

				httpRes.writeHead(200, { "Content-Type": "application/json" });
				httpRes.write(JSON.stringify(result));
				httpRes.end();
			}
		});
	});
}


function loginWithSession({ httpRes, userId, sessionId }) {
	httpRes.writeHead(200);
	if (loginSession.isValid(sessionId, +userId)) {
		httpRes.write(JSON.stringify({ authorized: true }));
	} else {
		httpRes.write(JSON.stringify({ authorized: false }));
	}
	httpRes.end();
}


module.exports = { login, loginWithSession };
