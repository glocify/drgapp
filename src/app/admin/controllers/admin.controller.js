(function () {
    'use strict';

    angular
        .module('app')
        .controller('AdminController', AdminController);

    /** @ngInject */
    function AdminController($state, $filter) {
        var vm = this;

        vm.tabs = [
            {id: "main", heading: "Main Settings", active: true},
            {id: "category", heading: "Categories"},
            {id: "restaurant", heading: "Restaurants"},
            {id: "address", heading: "Addresses"},
            {id: "ads", heading: "Advertisements"}
        ];

        vm.selectTab = function (tab) {
            $state.go("admin." + tab.id);
        };
        vm.selectTab($filter('filter')(vm.tabs, {active:true}, true)[0]);
    }
})();
