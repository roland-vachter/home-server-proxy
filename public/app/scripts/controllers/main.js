'use strict';

angular.module('heatingFrontend')
	.controller('MainCtrl', ['$scope', '$timeout', 'socketio', 'ambientalConditions', function($scope, $timeout, socketio, ambientalConditions) {
		var lastActivity = new Date();

		function init () {
			$scope.charts = {
				temperature: {
					options: {
						chart: {
							type: 'lineChart',
							height: 250,
							margin: {
								top: 20,
								right: 20,
								bottom: 40,
								left: 55
							},
							x: function(d) {
								return d.x;
							},
							y: function(d) {
								return d.y;
							},
							useInteractiveGuideline: true,
							showValues: true,
							xAxis: {
								axisLabel: 'Date',
								tickFormat: function(d) {
									return d3.time.format('%b %d, %Hh')(new Date(d));
								}
							},
							yAxis: {
								axisLabel: 'Temperature',
								axisLabelDistance: -10
							},
							forceY: [-1, 25],
							interpolate: 'basis'
						}
					}
				},
				humidity: {
					options: {
						chart: {
							type: 'lineChart',
							height: 250,
							margin: {
								top: 20,
								right: 20,
								bottom: 40,
								left: 55
							},
							x: function(d) {
								return d.x;
							},
							y: function(d) {
								return d.y;
							},
							useInteractiveGuideline: true,
							showValues: true,
							xAxis: {
								axisLabel: 'Date',
								tickFormat: function(d) {
									return d3.time.format('%b %d, %Hh')(new Date(d));
								}
							},
							yAxis: {
								axisLabel: 'Humidity',
								axisLabelDistance: -10
							},
							forceY: [0,100],
							interpolate: 'basis'
						}
					}
				}
			};


			ambientalConditions.getPast().then(function(data) {
				var tempChartData = [{
					key: "Outside temperature",
					values: []
				}];
				var humidityChartData = [{
					key: "Outside humidity",
					values: []
				}];

				var minTemp;
				var lastTemp;
				var lastHumidity;
				data.forEach(function(obj, index) {
					if (!minTemp || obj.outside.temperature < minTemp) {
						minTemp = obj.outside.temperature;
					}

					if (obj.outside.temperature !== lastTemp || index === data.length - 1) {
						lastTemp = obj.outside.temperature;

						tempChartData[0].values.push({
							x: new Date(obj.date),
							y: obj.outside.temperature
						});
					}

					if (obj.outside.humidity !== lastHumidity || index === data.length - 1) {
						lastHumidity = obj.outside.humidity;

							humidityChartData[0].values.push({
							x: new Date(obj.date),
							y: obj.outside.humidity
						});
					}
				});

				$scope.charts.temperature.options.chart.forceY[0] = minTemp - 1;

				$scope.charts.temperature.data = tempChartData;
				$scope.charts.humidity.data = humidityChartData;
			});


			var insideTempGauge;
			var insideHumidityGauge;
			var outsideTempGauge;
			var outsideHumidityGauge;

			ambientalConditions.getCurrent().then(function(data) {
				$scope.ambientalConditions = data;

				insideTempGauge = new JustGage({
					id: "inside-temp-gauge",
					value: data.inside.temperature,
					decimals: true,
					min: 5,
					max: 35,
					shadowOpacity: 0,
					levelColors: ['#337ab7', '#5bc0de', '#5cb85c', '#f9c802', '#d9534f'],
					title: "Temperature",
					symbol: '°'
				});

				insideHumidityGauge = new JustGage({
					id: "inside-humidity-gauge",
					value: data.inside.humidity,
					min: 0,
					max: 100,
					shadowOpacity: 0,
					levelColors: ['#d9534f', '#f9c802', '#5cb85c', '#f9c802', '#d9534f'],
					title: "Humidity",
					symbol: '%'
				});


				outsideTempGauge = new JustGage({
					id: "outside-temp-gauge",
					value: data.outside.temperature,
					min: -15,
					max: 60,
					shadowOpacity: 0,
					levelColors: ['#337ab7', '#5bc0de', '#5cb85c', '#f9c802', '#d9534f'],
					title: "Temperature",
					symbol: '°'
				});

				outsideHumidityGauge = new JustGage({
					id: "outside-humidity-gauge",
					value: data.outside.humidity,
					min: 0,
					max: 100,
					shadowOpacity: 0,
					levelColors: ['#d9534f', '#f9c802', '#5cb85c', '#f9c802', '#d9534f'],
					title: "Humidity",
					symbol: '%'
				});
			});
			ambientalConditions.listen((data) => {
				$scope.ambientalConditions = data;

				outsideTempGauge.refresh(data.outside.temperature);
				outsideHumidityGauge.refresh(data.outside.humidity);

				insideTempGauge.refresh(data.inside.temperature);
				insideHumidityGauge.refresh(data.inside.humidity);
			});
		}
		init();


		var inactivityTreshold = 60; //seconds
		window.addEventListener('focus', function () {
			console.log('window focused');
			if ((new Date().getTime() - lastActivity.getTime()) / 1000 > inactivityTreshold) {
				init();
			}

			lastActivity = new Date();
		});
	}]);
