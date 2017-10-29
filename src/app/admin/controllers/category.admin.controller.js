(function () {
    'use strict';

    angular
        .module('app')
        .controller('CategoryAdminController', CategoryAdminController)
        .controller('CategoryModalController', CategoryModalController);

    /** @ngInject */
    function CategoryAdminController($http, $uibModal, ServerURL) {
        var vm = this;
        vm.tableData = {};
        vm.currRowId = 0;
        vm.isNoData = false;

        vm.getData = function () {
            $http.get(ServerURL + "categories/getcategories").then(function (response) {
                vm.tableData = response.data;
                for (var r in vm.tableData) {
                    vm.tableData[r].image += '?' + Date.now();
                    vm.tableData[r].ads_image += '?' + Date.now();
                    vm.tableData[r].ads_image1 += '?' + Date.now();
                    vm.tableData[r].ads_image2 += '?' + Date.now();
                    vm.tableData[r].ads_image3 += '?' + Date.now();
                }
                vm.isNoData = !r;
            });
        };
        vm.getData();

        vm.saveData = function (data) {
            data['id'] = vm.currRowId;
            $http({
                method: 'POST',
                url: ServerURL + "categories/savecategory",
                headers: { 'Content-Type': 'multipart/form-data' },
                data: data
            }).then(function mySucces(/*response*/) {
                vm.modal.close();
                vm.getData();
            });
        };

        vm.deleteData = function (rowId) {
            if (confirm('Are you sure want to delete this?')) {
                $http.get(ServerURL + "categories/deletecategory?id=" + rowId).then(function (/*response*/) {
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
                templateUrl: 'category_form.html',
                controller: 'CategoryModalController',
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

    function CategoryModalController(pvm) {
        var vm = this;
        vm.data = {};

        if (pvm.currRowId) {
            vm.data.title = pvm.tableData[pvm.currRowId]['title'];
            vm.data.image = pvm.tableData[pvm.currRowId]['image'];
            vm.data.comment = pvm.tableData[pvm.currRowId]['comment'];
            vm.data.ads_image = pvm.tableData[pvm.currRowId]['ads_image'];
            vm.data.ads_image1 = pvm.tableData[pvm.currRowId]['ads_image1'];
            vm.data.ads_image2 = pvm.tableData[pvm.currRowId]['ads_image2'];
            vm.data.ads_image3 = pvm.tableData[pvm.currRowId]['ads_image3'];
        }

        vm.save = function () {
            pvm.saveData(vm.data);
        };

        vm.close = function () {
            pvm.modal.close();
        };

    }
})();


