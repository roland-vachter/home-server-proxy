(function () {
	'use strict';

	angular.module('heatingFrontend').service('loginStatus', loginStatus);

	function loginStatus($http) {
		var url = '/checkloginstatus';

		this.check = function () {
			$http.get(url).then(function () {
				// do nothing, user is logged in
			}, function () {
				document.location.reload();
			});
		};
	}
}());
