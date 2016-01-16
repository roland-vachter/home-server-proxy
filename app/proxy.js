"use strict";

var httpProxy = require('http-proxy');

var remoteAddress = null;
var readOnlyApiKey = null;
var adminApiKey = null;

var proxy = httpProxy.createProxyServer({});
proxy.on('proxyReq', function(proxyReq, req, res, options) {
	if (req.user) {
		if (req.user.accessLevel === 'readOnly') {
			proxyReq.setHeader('API_KEY', readOnlyApiKey);
		} else if (req.user.accessLevel === 'admin') {
			proxyReq.setHeader('API_KEY', adminApiKey);
		}
	}
});

exports.register = function(registerRemoteAddress, registerReadOnlyApiKey, registerAdminApiKey) {
	remoteAddress = registerRemoteAddress;
	readOnlyApiKey = registerReadOnlyApiKey;
	adminApiKey = registerAdminApiKey;
};


exports.proxyHttp = function(req, res, callback) {
	try {
		proxy.web(req, res, {
			target: remoteAddress
		}, callback);
	} catch (err) {
		res.send({
			error: "Remote server unreachable."
		});
	}
};

exports.proxyWebsockets = function(req, socket, head) {
	try {
		proxy.ws(req, socket, head, {
			target: remoteAddress
		});
	} catch (err) {
	}
};
