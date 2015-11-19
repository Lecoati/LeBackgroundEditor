angular.module("umbraco").factory("ColorPickerDataTypeRequestHelper",
    function ($http, umbRequestHelper) {
        return {
			
            /*********************/
            /*********************/
            getAll: function () {
                return umbRequestHelper.resourcePromise($http.get("/umbraco/backoffice/LeBackgroundEditorApi/ColorPickerDataType/GetAll"), 'Failed to retrieve datatypes from tree service');
            },
			
			/*********************/
            /*********************/
            getById: function (guid) {
                return umbRequestHelper.resourcePromise($http.get("/umbraco/backoffice/LeBackgroundEditorApi/ColorPickerDataType/GetById?guid=" + guid, { cache: true }), 'Failed to retrieve datatype');
            },
        }

    });