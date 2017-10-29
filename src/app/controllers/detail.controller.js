(function () {
    'use strict';

    angular
        .module('app')
        .controller('DetailController', DetailController);

    /** @ngInject */
    function DetailController($http, $state, ServerURL, $stateParams, $window) {
        var vm = this;
        vm.addressId = $stateParams.address;
        vm.data = {};
        vm.ads = [];
        vm.keyword = $stateParams.q;
        vm.adsVideoURL = ServerURL + 'uploads/temp-video-ads.mp4';

        vm.getRestaurant = function () {
            $http.get(ServerURL + "restaurants/getrestaurantdetail?address=" + vm.addressId).then(function (response) {
				
				$window.navigator.geolocation.getCurrentPosition(function (pos) {
            vm.currentLocation = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            };
			});
				
                vm.data = response.data;
                vm.ads = [];
                for (var i in vm.data.ads) {
                    vm.ads[vm.ads.length] = vm.data.ads[i];
                    if (vm.ads.length == 12) break;
                }
                if (vm.ads.length <= 12) {
                    for (i = vm.ads.length; i < 12; i++) {
                        vm.ads[vm.ads.length] = {
                            id: 0,
                            image: './assets/images/no.jpg'
                        };
                    }
                }
            });
        };
        vm.getRestaurant();

        vm.search = function () {
            $state.go('restaurants', {'category': vm.data.category_id, 'q': vm.keyword});
        };

        vm.onKeyUp = function () {
            if (event.keyCode == 13) {
                vm.search();
            }
        };

        vm.goBack = function () {
            $state.go('restaurants', {'category': vm.data.category_id, 'q': vm.keyword});
        };

        vm.openDelivery = function (url) {
            if (url != '') {
                $window.open(url);
            }
        };

    }
})();
