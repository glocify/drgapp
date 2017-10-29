(function () {
    'use strict';

    angular.module('app').directive('videoAds', function () {
        return {
            restrict: 'E',
            template: '<div id="{{id}}_ads" class="video-ads"></div>',
            scope: {
                id: '@',
                class: '@'
            },
            link: function (/*scope*/) {
                /*var playerInstance = jwplayer(scope + "_ads");
                playerInstance.setup({
                    image: "/uploads/myPoster.jpg",
                    file: "/uploads/myVideo.mp4",
                    advertising: {
                        client: "vast",
                        tag: "//adserver.com/vastResponse.xml"
                    }
                });*/
            }
        };
    })
})();
