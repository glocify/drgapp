(function () {
    'use strict';

    angular
        .module('app')
        .controller('CategoriesController', CategoriesController);

    /** @ngInject */
    function CategoriesController($state, $http, ServerURL, $interval) {
        var vm = this;
        vm.keyword = "";
        vm.staticImages = [];
        vm.dynamicImages = [];
        vm.imageInd = 0;
        vm.foodcates = {};

        vm.getCategories = function () {
            $http.get(ServerURL + "categories/getcategories").then(function (response) {
                vm.foodcates = response.data;
            });
        };
        vm.getCategories();

        vm.getMainImages = function () {
            $http.get(ServerURL + "settings/getmainads").then(function (response) {
                vm.staticImages = response.data['static'];
                vm.dynamicImages = response.data['dynamic'];
            });
        };
        vm.getMainImages();

        vm.ads = [1, 2, 3];

        vm.openRestaurants = function (categoryId) {
            $state.go('restaurants', {'category': categoryId});
        };

        vm.search = function () {
            $state.go('restaurants', {'q': vm.keyword});
        };

        vm.onKeyUp = function () {
            if (event.keyCode == 13) {
                vm.search();
            }
        };

        vm.goBack = function () {
            $state.go('home');
        };

        $interval(function () {
            if (vm.imageInd >= 2) {
                vm.imageInd = 0;
            } else {
                vm.imageInd++;
            }
        }, 10000);
    }
})();
