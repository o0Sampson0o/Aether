const { v4: uuidv4 } = require("uuid");

const loginSession = {};
const emailSession = {};

function createSessionUtilsFor(session, defaultDuration = 0, defaultPadding = 0) { // in milliseconds
	return {
		DEFAULT_DURATION: defaultDuration,
		DEFAULT_PADDING: defaultPadding,
		create: function (key, createdDate = Date.now(), duration = defaultDuration) {
			let sessionId = uuidv4();

			while (this.isValid(sessionId, key)) {
				sessionId = uuidv4();
			}

			session[sessionId] = { key, createdDate, expireDate: createdDate + duration };

			return Object.freeze({ sessionId, ...session[sessionId] });
		},
		createWithInfo: function (key, info, createdDate = Date.now(), duration = defaultDuration) {
			let sessionId = uuidv4();

			while (this.isValid(sessionId, key)) {
				sessionId = uuidv4();
			}

			session[sessionId] = { key, createdDate, expireDate: createdDate + duration, info };

			return Object.freeze({ sessionId, ...session[sessionId] });
		},
		isValid: function (sessionId, key) {
			if (!session[sessionId]) {
				return false;
			}

			const { key: _key, createdDate, expireDate } = session[sessionId];
			const date = Date.now();

			if (key != null && _key !== key) {
				return false;
			}

			if (createdDate < date && date < expireDate) {
				return true;
			}
			
            delete session[sessionId];
			
            return false;
		},
		getInfo: function (sessionId) {
			return session[sessionId].info;
		},
		delete: function (sessionId) {
			delete session[sessionId];
		}
	};
}

module.exports = {
	loginSession: createSessionUtilsFor(loginSession, 14 * 24 * 60 * 60 * 1000, 1 * 24 * 60 * 60 * 1000), // 14 days, 1 day
	emailSession: createSessionUtilsFor(emailSession, 20 * 60 * 1000) // 20 mins, no padding
};
