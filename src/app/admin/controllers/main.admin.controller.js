(function () {
    'use strict';

    angular
        .module('app')
        .controller('MainAdminController', MainAdminController);

    /** @ngInject */
    function MainAdminController($http, ServerURL) {
        var vm = this;
        vm.staticImages = [];
        vm.dynamicImages = [];

        vm.getData = function () {
            $http.get(ServerURL + "settings/getmainads").then(function (response) {
                for (var s in response.data.static) {
                    vm.staticImages[vm.staticImages.length] = response.data.static[s];
                }
                for (var d in response.data.dynamic) {
                    vm.dynamicImages[vm.dynamicImages.length] = response.data.dynamic[d];
                }
            });
        };
        vm.getData();

        vm.saveData = function () {
            var data = {
                'static': vm.staticImages,
                'dynamic': vm.dynamicImages
            }
            $http({
                method: 'POST',
                url: ServerURL + "settings/savemainads",
                headers: {'Content-Type': 'multipart/form-data'},
                data: data
            }).then(function mySucces() {
                alert('saved!');
            });
        };
    }
})();


