'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('heatingFrontend')
	.directive('chat',function(){
		return {
        templateUrl:'/app/scripts/directives/chat/chat.html',
        restrict: 'E',
        replace: true,
    	}
	});


