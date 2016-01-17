(function () {
	"use strict";

	angular.module('heatingFrontend').service('ambientalConditions', handleApi);

	function handleApi (heatingControlApi, socketio) {
		var handleResponse = function (result) {
			return result.data;
		};

		this.getCurrent = function () {
			return heatingControlApi.get('/ambiental-conditions').then(handleResponse);
		};

		this.getPast = function (start, end) {
			return heatingControlApi.get('/ambiental-past-conditions').then(handleResponse);
		};

		this.listen = function (callback) {
			socketio.on('ambiental-conditions', function (data) {
				callback(data);
			});
		};
	}
}());
