(function () {
	"use strict";

	angular.module('heatingFrontend').service('ambientalConditions', handleApi);

	function handleApi (heatingControlApi, socketio) {
		var endpoint = '/ambiental-conditions';

		var handleResponse = function (result) {
			return result.data;
		};

		this.get = function () {
			return heatingControlApi.get(endpoint).then(handleResponse);
		};

		this.listen = function (callback) {
			socketio.on('ambiental-conditions', function (data) {
				callback(data);
			});
		};
	}
}());
