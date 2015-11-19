angular.module("umbraco").controller("LeBackgroundEditor",
    function ($scope, ColorPickerDataTypeRequestHelper) {
		var localValue = {
			opacity: 1,
			mediaPicker: {
				config: {}
			},
			colorPicker: {
				config: {
					items: ($scope.model.config && $scope.model.config.colors ? $scope.model.config.colors : null) || ($scope.model.prevalues && $scope.model.prevalues.colors ? $scope.model.prevalues.colors : null) || [null]
				},
				validation: {
					mandatory: false
				}
			}
		}
		
		$scope.Math = Math;
		$scope.localValue = localValue;
		
		//Function to convert hex format to a rgb color
		function rgb2hex(rgb){
			rgb = rgb || "";
			rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d(?:\.[\d]*)?)[\s+]?/i);
			var hex = (rgb && rgb.length === 5) ? "#" +
				("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
				("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
				("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : "";
			var opacity = (rgb && rgb.length === 5) ? parseFloat(rgb[4]).toFixed(2) : 1.0;
			return {
				hex: hex,
				opacity: opacity
			};
		}

		function hex2rgb(hex, opacity) {
			hex = hex || ""
			hex = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
			return (hex && hex.length === 4) ? "rgba(" + 
				parseInt(hex[1], 16) + "," + 
				parseInt(hex[2], 16) + "," +  
				parseInt(hex[3], 16) + "," +  
				parseFloat(opacity).toFixed(2) + 
				")" : "";
		}
		
		$scope.backgroundPickerToggle = $scope.model.value && $scope.model.value.indexOf('url') != -1;
		if($scope.backgroundPickerToggle) {
			localValue.mediaPicker.value = $scope.model.value.substring($scope.model.value.lastIndexOf("(")+1,$scope.model.value.lastIndexOf(")"));
		}
		else {
			var result = rgb2hex($scope.model.value);
			localValue.colorPicker.value = result.hex;
			localValue.opacity = result.opacity;
		}
		
		$scope.mediaPickerController = function($scope){
			$scope.model = localValue.mediaPicker;
		}
		
		$scope.colorPickerController = function($scope){
			var colorsDataType = ($scope.model.config && $scope.model.config.colorsDataType ? $scope.model.config.colorsDataType : null) || ($scope.model.prevalues && $scope.model.prevalues.colorsDataType ? $scope.model.prevalues.colorsDataType : null);
			if(colorsDataType) {
				ColorPickerDataTypeRequestHelper.getById(colorsDataType).then(function (data) {
					var items = data.preValues[0].value;
					
					if(items) {
						localValue.colorPicker.config.items = Object.keys(items).map(function (key) { return "#" + items[key] });
					}
				});
			}
			else {
				if(localValue.colorPicker.config.items.length > 0 && localValue.colorPicker.config.items[0]) {
					localValue.colorPicker.config.items.forEach(function(item, index, colors) {
						if((item.value || item).indexOf("#") != 0) {
							colors[index] = "#" + (item.value || item);
						}
					});
				}
				else {
					localValue.colorPicker.config.items = [];
				}
			}
			
			$scope.model = localValue.colorPicker;
		};
		
		function saveColorPickerValue(newValue, opacity) {
			$scope.model.value = hex2rgb(newValue, opacity);
		}
		
		function saveMediaPickerValue(newValue) {
			$scope.model.value = newValue ? "url(" + newValue + ")" : newValue;
		}
		
		$scope.toggleBackgroundPicker = function() {
			$scope.backgroundPickerToggle = !$scope.backgroundPickerToggle;
			
			if($scope.backgroundPickerToggle) {
				saveMediaPickerValue(localValue.mediaPicker.value);
			}
			else {
				saveColorPickerValue(localValue.colorPicker.value, localValue.opacity);
			}
		}
		
		$scope.$watch(function() { return localValue.mediaPicker.value; },
			function(newValue, oldValue) {
				if(newValue != oldValue) {
					saveMediaPickerValue(newValue);
				}
			}
		);
		
		$scope.$watch(function() { return localValue.colorPicker.value; },
			function(newValue, oldValue) {
				if(newValue != oldValue) {
					saveColorPickerValue(newValue, localValue.opacity);
				}
			}
		);
		
		$scope.$watch(function() { return localValue.opacity; },
			function(newValue, oldValue) {
				if(newValue != oldValue) {
					saveColorPickerValue(localValue.colorPicker.value, newValue);
				}
			}
		);
	}
);