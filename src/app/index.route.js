(function () {
    'use strict';

    angular
        .module('app')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        // var nn = new Date();
        // if (nn.getTime() < 1489100400000) {
            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: 'app/views/home.html',
                    controller: 'HomeController',
                    controllerAs: 'vm'
                })
                .state('categories', {
                    url: '/categories',
                    templateUrl: 'app/views/categories.html',
                    controller: 'CategoriesController',
                    controllerAs: 'vm'
                })
                .state('restaurants', {
                    url: '/restaurants/:category?q',
                    templateUrl: 'app/views/restaurants.html',
                    controller: 'RestaurantsController',
                    controllerAs: 'vm'
                })
                .state('detail', {
                    url: '/detail/:address?q',
                    templateUrl: 'app/views/detail.html',
                    controller: 'DetailController',
                    controllerAs: 'vm'
                })

                .state('admin', {
                    url: '/admin',
                    templateUrl: 'app/admin/views/admin.html',
                    controller: 'AdminController',
                    controllerAs: 'vm'
                })
                .state('admin.main', {
                    url: '/main',
                    views: {
                        "tabContent": {
                            templateUrl: 'app/admin/views/main.admin.html',
                            controller: 'MainAdminController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('admin.category', {
                    url: '/category',
                    views: {
                        "tabContent": {
                            templateUrl: 'app/admin/views/category.admin.html',
                            controller: 'CategoryAdminController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('admin.restaurant', {
                    url: '/restaurant',
                    views: {
                        "tabContent": {
                            templateUrl: 'app/admin/views/restaurant.admin.html',
                            controller: 'RestaurantAdminController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('admin.address', {
                    url: '/address',
                    views: {
                        "tabContent": {
                            templateUrl: 'app/admin/views/address.admin.html',
                            controller: 'AddressAdminController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('admin.ads', {
                    url: '/ads',
                    views: {
                        "tabContent": {
                            templateUrl: 'app/admin/views/ads.admin.html',
                            controller: 'AdsAdminController',
                            controllerAs: 'vm'
                        }
                    }
                })
        // }

        $urlRouterProvider.otherwise('/');

    }

})();
