'use strict';

angular
	.module('heatingFrontend', [
		'oc.lazyLoad',
		'ui.router',
		'ui.bootstrap',
		'angular-loading-bar',
		'nvd3'
	])
	.config(['$stateProvider','$urlRouterProvider','$ocLazyLoadProvider',function ($stateProvider,$urlRouterProvider,$ocLazyLoadProvider) {

		$ocLazyLoadProvider.config({
			debug:false,
			events:true,
		});

		$urlRouterProvider.otherwise('/dashboard/home');

		$stateProvider
			.state('dashboard', {
				url:'/dashboard',
				templateUrl: '/app/views/dashboard/main.html',
				resolve: {
					loadMyDirectives:function($ocLazyLoad){
						return $ocLazyLoad.load(
						{
								name:'heatingFrontend',
								files:[
									'/app/scripts/directives/header/header.js'
								]
						}),
						$ocLazyLoad.load(
						{
							name:'toggle-switch',
							files:[
								"/bower_components/angular-toggle-switch/angular-toggle-switch.min.js",
								"/bower_components/angular-toggle-switch/angular-toggle-switch.css"
							]
						}),
						$ocLazyLoad.load(
						{
							name:'ngAnimate',
							files:['/bower_components/angular-animate/angular-animate.js']
						}),
						$ocLazyLoad.load(
						{
							name:'ngCookies',
							files:['/bower_components/angular-cookies/angular-cookies.js']
						}),
						$ocLazyLoad.load(
						{
							name:'ngResource',
							files:['/bower_components/angular-resource/angular-resource.js']
						}),
						$ocLazyLoad.load(
						{
							name:'ngSanitize',
							files:['/bower_components/angular-sanitize/angular-sanitize.js']
						}),
						$ocLazyLoad.load(
						{
							name:'ngTouch',
							files:['/bower_components/angular-touch/angular-touch.js']
						});
					}
				}
			})
			.state('dashboard.home',{
				url:'/home',
				controller: 'MainCtrl',
				templateUrl:'/app/views/dashboard/home.html',
				resolve: {
					loadMyFiles:function($ocLazyLoad) {
						return $ocLazyLoad.load({
							name:'heatingFrontend',
							files:[
								'/app/scripts/controllers/main.js',
								'/app/scripts/directives/timeline/timeline.js',
								'/app/scripts/directives/notifications/notifications.js',
								'/app/scripts/directives/chat/chat.js',
								'/app/scripts/directives/dashboard/stats/stats.js',
								'/app/scripts/components/shared/api.service.js',
								'/app/scripts/components/socketio.service.js',
								'/app/scripts/components/ambientalConditions.service.js',
								'/app/scripts/components/loginStatus.service.js',
							]
						});
					}
				}
			});
	}]);


