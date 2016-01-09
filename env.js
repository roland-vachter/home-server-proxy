const config = {
	apiKeys: {
		own: process.env.OWN_API_KEY,
		server: {
			readOnly: process.env.HOME_SERVER_READ_ONLY_API_KEY,
			admin: process.env.HOME_SERVER_ADMIN_API_KEY
		}
	},
	facebook: {
		app: {
			id: process.env.FACEBOOK_APP_ID,
			secret: process.env.FACEBOOK_APP_SECRET
		}
	},
	users: {},
	ownHost: process.env.OWN_HOST
};
const readOnlyUsers = process.env.READ_ONLY_USERS ? process.env.READ_ONLY_USERS.split(',') : [];
const adminUsers = process.env.ADMIN_USERS ? process.env.ADMIN_USERS.split(',') : [];

config.users.readOnly = readOnlyUsers || [];
config.users.admin = adminUsers || [];

module.exports = config;
