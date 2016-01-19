'use strict';

angular.module('heatingFrontend')
	.controller('MainCtrl', ['$scope', '$timeout', 'socketio', 'ambientalConditions', function($scope, $timeout, socketio, ambientalConditions) {
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

		ambientalConditions.getCurrent().then(function(data) {
			$scope.ambientalConditions = data;
		});
		ambientalConditions.listen((data) => {
			$scope.ambientalConditions = data;
		});
	}]);
