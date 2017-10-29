(function () {
    'use strict';

    angular
        .module('app')
        .directive('searchBox', function ($state, $window, $timeout) {
            return {
                template: '<div class="input-group search-box">' +
                '<input type="text" class="form-control" id="keyword-box" ng-keyup="keyUp()" placeholder="{{translate(\'Search for...\')}}" ng-model="q">' +
                '<span class="input-group-btn">' +
                '<button class="btn btn-primary" type="button" ng-click="search();"><i class="glyphicon glyphicon-search"></i></button>' +
                '</span>' +
                '</div>',
                scope: {
                    keyword: "=keyword"
                },
                link: function (scope) {
                    scope.q = scope.keyword;
                    scope.keyUp = function () {
                        if (event.keyCode == 13) {
                            scope.search();
                        }
                    };
                    scope.search = function () {
                        $state.go('restaurants', {'q': scope.q});
                        $timeout(function () {
                            $window.document.getElementById("keyword-box").focus();
                        }, 100);
                    };
                }
            };
        });
})();
