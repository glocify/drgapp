(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    /** @ngInject */
    function HomeController($state, $rootScope) {
        var vm = this;
        vm.langInd = localStorage.lang || 0;

        vm.chooseLanguage = function () {
            $rootScope.langInd = vm.langInd;
            localStorage.lang = vm.langInd;
            vm.openFoodlist();
        };

        vm.openFoodlist = function () {
            $state.go('categories');
        };
    }
})();
