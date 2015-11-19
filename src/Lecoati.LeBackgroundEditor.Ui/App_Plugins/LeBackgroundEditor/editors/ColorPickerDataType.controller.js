angular.module("umbraco").controller("ColorPickerDataType.Controller",
    function ($scope, ColorPickerDataTypeRequestHelper) {

        /***************************************/
        /* init */
        /***************************************/

        // Init availableDataTypes
        ColorPickerDataTypeRequestHelper.getAll().then(function (data) {
            $scope.availableDataTypes = data;
        });

    });