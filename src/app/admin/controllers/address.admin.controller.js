(function () {
    'use strict';

    angular
        .module('app')
        .controller('AddressAdminController', AddressAdminController)
        .controller('AddressModalController', AddressModalController);

    /** @ngInject */
    function AddressAdminController($http, $uibModal, ServerURL) {
        var vm = this;
        vm.category = 0;
        vm.restaurant = 0;
        vm.currRowId = 0;
        vm.tableData = {};
        vm.categories = {};
        vm.isNoData = false;


        vm.getCategories = function () {
            $http.get(ServerURL + "categories/getcategories").then(function (response) {
                vm.categories = response.data;
                for (var c in vm.categories) {
                    vm.category = vm.categories[c].id;
                    break;
                }
                vm.getRestaurants();
            });
        };
        vm.getCategories();

        vm.getRestaurants = function () {
            $http.get(ServerURL + "restaurants/getrestaurants?category=" + vm.category).then(function (response) {
                vm.restaurants = response.data;
                for (var r in vm.restaurants) {
                    vm.restaurant = vm.restaurants[r].id;
                    break;
                }
                vm.getData();
            });
        };

        vm.getData = function () {
            $http.get(ServerURL + "addresses/getaddresses?restaurant=" + vm.restaurant).then(function (response) {
                vm.tableData = response.data;
                for (var r in vm.tableData) {
                    vm.tableData[r].image += '?' + Date.now();
                }
                vm.isNoData = !r;
            });
        };


        vm.saveData = function (data) {
            data['id'] = vm.currRowId;
            data['restaurant_id'] = vm.restaurant;
            $http({
                method: 'POST',
                url: ServerURL + "addresses/saveaddress",
                headers: {'Content-Type': 'multipart/form-data'},
                data: data
            }).then(function mySucces(/*response*/) {
                vm.modal.close();
                vm.getData();
            });
        };

        vm.deleteData = function (rowId) {
            if (confirm('Are you sure want to delete this?')) {
                $http.get(ServerURL + "addresses/deleteaddress?id=" + rowId).then(function (/*response*/) {
                    vm.getData();
                });
            }
        }

        vm.openModal = function (rowId) {
            vm.currRowId = rowId;
            if (vm.restaurant) {
                vm.modal = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'address_form.html',
                    controller: 'AddressModalController',
                    controllerAs: 'vm',
                    size: 'lg',
                    resolve: {
                        pvm: function () {  // giving parent scope.
                            return vm;
                        }
                    }
                });
            }
            vm.modal.result.then(function () {  // originally used selectedItem for parameter.
                vm.currRowId = 0;
            }, function () {
                vm.currRowId = 0;
            });
        };
    }

    function AddressModalController(pvm, $timeout) {
        var vm = this;
        vm.data = {};
        vm.location = {
            name: null,
            lat: null,
            lng: null
        };
        if (pvm.currRowId) {
            vm.data.sign = pvm.tableData[pvm.currRowId]['sign'];
            vm.data.address = pvm.tableData[pvm.currRowId]['address'];

            vm.location.name = pvm.tableData[pvm.currRowId]['address'] + ', ' + pvm.tableData[pvm.currRowId]['city'];
            vm.location.address = pvm.tableData[pvm.currRowId]['address'];
            vm.location.lat = pvm.tableData[pvm.currRowId]['lat'];
            vm.location.lng = pvm.tableData[pvm.currRowId]['lng'];

            vm.data.city = pvm.tableData[pvm.currRowId]['city'];
            vm.data.state = pvm.tableData[pvm.currRowId]['state'];
            vm.data.zip_code = pvm.tableData[pvm.currRowId]['zip_code'];
            vm.data.phone = pvm.tableData[pvm.currRowId]['phone'];
            vm.data.time_val = pvm.tableData[pvm.currRowId]['time_val'];
            vm.data.cost = pvm.tableData[pvm.currRowId]['cost'];
            vm.data.image = pvm.tableData[pvm.currRowId]['image'];

        }

        vm.save = function () {
            vm.data.address = vm.location.address;
            vm.data.lat = vm.location.lat;
            vm.data.lng = vm.location.lng;
            pvm.saveData(vm.data);
        };

        vm.close = function () {
            pvm.modal.close();
        };

        $timeout(function () {
            angular.element('.pac-container').css({zIndex: 2000});
        }, 1000);
    }
})();


