"use strict";

// ----------------------------------------    dependencies    ----------------------------------------
const bcrypt = require("bcrypt");
const sqlConnection = require("../../sqlConnection").getConnection();
const { LOG, MODE } = require("../../logger.js");
const nodemailer = require("nodemailer");

// ----------------------------------------        utils       ----------------------------------------
const { sqlEscape } = require("../../utils/sqlUtils");
const { readRequestBody } = require("../../utils/httpUtils");

// ----------------------------------------   global variable  ----------------------------------------
const Aether = require("../../globalConstant/database");
const { SALT_ROUND } = require("../../globalConstant/bcrypt");
const { emailSession } = require("../../globalVariable/session");

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.emailAddr,
		pass: process.env.emailPassword
	}
});

function signup({ httpRes, httpReq }) {
	const result = {
		emailErrorMessage: ""
	};

	readRequestBody(httpReq).then((body) => {
		const username = sqlEscape(body.username);
		const password = body.password;
		const email = sqlEscape(body.email);

		const query = `SELECT email FROM ${Aether.userAcc} WHERE email='${email}'`;
		sqlConnection.query(query, (sqlErr, sqlResult) => {
			if (sqlErr) {
				result.emailErrorMessage = "Unknown error";

				httpRes.writeHead(500, { "Content-Type": "application/json" });
				httpRes.write(JSON.stringify(result));
				httpRes.end();
				return;
			}

			if (sqlResult.length > 0) {
				result.emailErrorMessage = "email already exist";

				httpRes.writeHead(409, { "Content-Type": "application/json" });
				httpRes.write(JSON.stringify(result));
				httpRes.end();
				return;
			}

			httpRes.writeHead(200, { "Content-Type": "application/json" });
			httpRes.write(JSON.stringify(result));
			httpRes.end();

			const session = emailSession.createWithInfo(email, {
				username,
				email,
				password
			});

			const mailOptions = {
				from: process.env.emailAddr,
				to: `${email}`,
				subject: "Aether account activation",
				text: `Hi ${username}, just click this URL http://127.0.0.1:3000/account/activation/${session.sessionId} and your account will be activated ( valid for 20 minutes )`
			};

			transporter.sendMail(mailOptions, function (error, info) {});
		});
	});
}

function activate({ httpRes, sessionId }) {
	const result = {
		invalid: false,
		error: false
	};

	if (!emailSession.isValid(sessionId)) {
		result.invalid = true;
		
		httpRes.writeHead(200, { "content-type": "application/json" });
		httpRes.write(JSON.stringify(result));
		httpRes.end();
		return;
	}
	const { username, password, email } = emailSession.getInfo(sessionId);

	bcrypt
		.genSalt(SALT_ROUND)
		.then((salt) => bcrypt.hash(password, salt))
		.then((hashedPassword) => {
			const sql = `INSERT INTO ${Aether.userAcc} (username, email, hashedPassword) VALUES ('${username}', '${email}','${hashedPassword}')`;

			sqlConnection.query(sql, (sqlErr) => {
				if (sqlErr) {
					if (sqlErr.code !== "ER_DUP_ENTRY") {
						throw sqlErr;
					}

					result.error = true;
				}

				httpRes.writeHead(200, { "Content-Type": "application/json" });
				httpRes.write(JSON.stringify(result));
				httpRes.end();

				emailSession.delete(sessionId);
			});
		})
		.catch((bCryptErr) => {
			throw bCryptErr;
		});
}

module.exports = { signup, activate };
