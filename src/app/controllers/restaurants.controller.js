(function () {
    'use strict';

    angular
        .module('app')
        .controller('RestaurantsController', RestaurantsController);

    /** @ngInject */
    function RestaurantsController($state, $stateParams, $http, ServerURL, $window, $interval) {
        var vm = this;
        vm.category = $stateParams.category || '';
        vm.keyword = $stateParams.q || '';
        vm.restaurants = {};
        vm.here = {
            lat: 37.403699,
            lng: -121.979006
        };
        vm.categoryLink = '';
        vm.fixedAdsImage = ServerURL + 'uploads/category_ads/' + vm.category + '.jpg';
        
        vm.adsInd = 0;
        vm.adsVideoURL = ServerURL + 'uploads/temp-video-ads.mp4';

        vm.paginator = {
            prev_btn: './assets/images/prev.png',
            next_btn: './assets/images/next.png'
        };
        vm.currentPage = 0;
        vm.maxPageNum = 1;

        $window.navigator.geolocation.getCurrentPosition(function (pos) {
            vm.here = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            };
            vm.getData();
        }, function () {
            vm.getData();
        });

        vm.getData = function () {
            var url = ServerURL + "restaurants/searchrestaurants";
            url += "?category=" + vm.category;
            url += "&q=" + vm.keyword;
            url += "&lat=" + vm.here.lat;
            url += "&lng=" + vm.here.lng;

            $http.get(url).then(function (response) {
                vm.currentPage = 0;
				vm.fixedAdsImage = response.data[0]['groupon_deal'];
				
				vm.cateAdsImages = [
				ServerURL + 'uploads/category_ads/' + response.data[0]['category_id'] + '_1.jpg',
				ServerURL + 'uploads/category_ads/' + response.data[1]['category_id'] + '_2.jpg',
				ServerURL + 'uploads/category_ads/' + response.data[2]['category_id'] + '_3.jpg'
				];
                vm.maxPageNum = Math.ceil(response.data.length / 14);
                if (response.data.length) vm.categoryLink = response.data[0]['groupon_dealUrl'];    // link, that should be removed after done api.

                var pageInd = 0;
                vm.restaurants = [[]];
                for (var i = 0; i < 42; i++) {
                    if (i % 14 == 0 && i > 0) pageInd++;
                    if (!vm.restaurants[pageInd]) vm.restaurants[pageInd] = [];

                    if (response.data[i]) {
                        vm.restaurants[pageInd][vm.restaurants[pageInd].length] = response.data[i];
                    } else {
                        vm.restaurants[pageInd][vm.restaurants[pageInd].length] = {id: 0, image: './assets/images/no.jpg'};
                    }
                }
            });
        };

        vm.onKeyUp = function () {
            if (event.keyCode == 13) {
                vm.getData();
            }
        };

        vm.ads = [1, 2, 3];

        vm.openRestDetail = function (address) {
            if (address) {
                $state.go('detail', {'address': address, 'q': vm.keyword});
            }
        };

        vm.goBack = function () {
            $state.go('categories', {});
        };

        vm.nextPage = function () {
            if (vm.currentPage >= vm.maxPageNum - 1) return;
            vm.currentPage++;
        };
        vm.prevPage = function () {
            if (vm.currentPage <= 0) return;
            vm.currentPage--;
        };

        $interval(function () {
            if (vm.adsInd == 2) {
                vm.adsInd = 0;
            } else {
                vm.adsInd++;
            }
        }, 5000);
    }
})();
