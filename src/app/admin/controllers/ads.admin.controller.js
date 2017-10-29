(function () {
    'use strict';

    angular
        .module('app')
        .controller('AdsAdminController', AdsAdminController)
        .controller('AdsModalController', AdsModalController);

    /** @ngInject */
    function AdsAdminController($http, $uibModal, ServerURL) {
        var vm = this;
        vm.category = 0;
        vm.restaurant = 0;
        vm.currRowId = 0;
        vm.tableData = {};
        vm.categories = {};
        vm.isNoData = false;
        vm.partner = {
            id: '0',
            image1: './assets/images/no.jpg',
            link1: '',
            image2: './assets/images/no.jpg',
            link2: '',
            image3: './assets/images/no.jpg',
            link3: ''
        };

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
                vm.getPartner();
            });
        };

        vm.getData = function () {
            $http.get(ServerURL + "advertisements/getads?restaurant=" + vm.restaurant).then(function (response) {
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
                url: ServerURL + "advertisements/saveads",
                headers: {'Content-Type': 'multipart/form-data'},
                data: data
            }).then(function mySucces(/*response*/) {
                vm.modal.close();
                vm.getData();
            });
        };

        vm.deleteData = function (rowId) {
            if (confirm('Are you sure want to delete this?')) {
                $http.get(ServerURL + "advertisements/deleteads?id=" + rowId).then(function (/*response*/) {
                    vm.getData();
                });
            }
        };

        vm.getPartner = function () {
            $http.get(ServerURL + "partners/getpartner?restaurant=" + vm.restaurant).then(function (response) {
                vm.partner = response.data;
                if (vm.partner.id) {
                    for (var i = 1; i <= 3; i++) {
                        vm.partner['image' + i] += '?' + Date.now();
                    }
                } else {
                    for (var j = 1; j <= 3; j++) {
                        vm.partner['image' + j] = './assets/images/no.jpg';
                    }
                }
            });
        };

        vm.savePartner = function () {
            var data = {
                id: vm.partner.id,
                restaurant_id: vm.restaurant,
                link1: vm.partner.link1,
                image1: vm.partner.image1,
                link2: vm.partner.link2,
                image2: vm.partner.image2,
                link3: vm.partner.link3,
                image3: vm.partner.image3
            };
            $http({
                method: 'POST',
                url: ServerURL + "partners/savepartner",
                headers: {'Content-Type': 'multipart/form-data'},
                data: data
            }).then(function mySucces(/*response*/) {
                alert('The partners information saved successfully.');
                vm.getPartner();
            });
        };

        vm.openModal = function (rowId) {
            vm.currRowId = rowId;
            if (vm.restaurant) {
                vm.modal = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'ads_form.html',
                    controller: 'AdsModalController',
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

    function AdsModalController(pvm) {
        var vm = this;
        vm.data = {};
        if (pvm.currRowId) {
            vm.data.image = pvm.tableData[pvm.currRowId]['image'];
        }

        vm.save = function () {
            pvm.saveData(vm.data);
        };

        vm.close = function () {
            pvm.modal.close();
        };

    }
})();


