(function () {
    'use strict';

    angular
        .module('app')
        .controller('RestaurantAdminController', RestaurantAdminController)
        .controller('RestaurantModalController', RestaurantModalController);

    /** @ngInject */
    function RestaurantAdminController($http, $uibModal, ServerURL) {
        var vm = this;
        vm.tableData = {};
        vm.category = 0;
        vm.categories = {};
        vm.currRowId = 0;
        vm.isNoData = false;

        vm.getCategories = function () {
            $http.get(ServerURL + "categories/getcategories").then(function (response) {
                vm.categories = response.data;
                for (var c in vm.categories) {
                    vm.category = vm.categories[c].id;
                    break;
                }

                vm.getData();
            });
        };
        vm.getCategories();

        vm.getData = function () {
            $http.get(ServerURL + "restaurants/getrestaurants?category=" + vm.category).then(function (response) {
                vm.tableData = response.data;
                for (var r in vm.tableData) {
                    vm.tableData[r].image += '?' + Date.now();
                    vm.tableData[r].o_image += '?' + Date.now();
                    vm.tableData[r].menu_image += '?' + Date.now();
                    vm.tableData[r].coupon_image += '?' + Date.now();
                }
                vm.isNoData = !r;
            });
        };


        vm.saveData = function (data) {
            data['id'] = vm.currRowId;
            data['category_id'] = vm.category;
            $http({
                method: 'POST',
                url: ServerURL + "restaurants/saverestaurant",
                headers: {'Content-Type': 'multipart/form-data'},
                data: data
            }).then(function mySucces(/*response*/) {
                vm.modal.close();
                vm.getData();
            });
        };

        vm.deleteData = function (rowId) {
            if (confirm('Are you sure want to delete this?')) {
                $http.get(ServerURL + "restaurants/deleterestaurant?id=" + rowId).then(function (response) {
                    if (response.data.code == 'addr') {
                        alert("Couldn't delete because that has " + response.data.num +" sub restaurants.");
                    } else if (response.data.code == 'ads') {
                        alert("Couldn't delete because that has " + response.data.num +" advertisements.");
                    }
                    vm.getData();
                });
            }
        }

        vm.openModal = function (rowId) {
            vm.currRowId = rowId;
            vm.modal = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'restaurant_form.html',
                controller: 'RestaurantModalController',
                controllerAs: 'vm',
                size: 'lg',
                resolve: {
                    pvm: function () {  // giving parent scope.
                        return vm;
                    }
                }
            });

            vm.modal.result.then(function () {  // originally used selectedItem for parameter.
                vm.currRowId = 0;
            }, function () {
                vm.currRowId = 0;
            });
        };
    }

    function RestaurantModalController(pvm) {
        var vm = this;
        vm.data = {};
        if (pvm.currRowId) {
            vm.data.restaurant_name = pvm.tableData[pvm.currRowId]['restaurant_name'];
            vm.data.write_up = pvm.tableData[pvm.currRowId]['write_up'];
            vm.data.delivery_website = pvm.tableData[pvm.currRowId]['delivery_website'];
            vm.data.menu_website = pvm.tableData[pvm.currRowId]['menu_website'];
            vm.data.rest_type = pvm.tableData[pvm.currRowId]['rest_type'];
            vm.data.image = pvm.tableData[pvm.currRowId]['image'];
            vm.data.o_image = pvm.tableData[pvm.currRowId]['o_image'];
            vm.data.menu_image = pvm.tableData[pvm.currRowId]['menu_image'];
            vm.data.coupon_image = pvm.tableData[pvm.currRowId]['coupon_image'];
        }

        vm.save = function () {
            pvm.saveData(vm.data);
        };

        vm.close = function () {
            pvm.modal.close();
        };

    }
})();


