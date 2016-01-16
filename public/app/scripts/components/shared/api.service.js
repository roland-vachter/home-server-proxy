(function () {
	'use strict';

	angular.module('heatingFrontend').service('heatingControlApi', heatingControlApi);

	function heatingControlApi($http) {
		var apiUrl = '/api/';

		this.get = function (endpoint) {
			return $http.get(apiUrl + endpoint);
		};

		this.set = function (endpoint, data) {
			return $http.put(apiUrl + endpoint, data);
		};
	}
}());
