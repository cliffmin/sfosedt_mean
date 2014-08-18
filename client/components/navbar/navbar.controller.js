'use strict';

angular.module('fullstackApp')
    .controller('NavbarCtrl', function($scope, $location) {
        $scope.menu = [{
            'title': 'Home',
            'link': '/'
        }, {
            'title': 'view SFOS',
            'link': '/view'
        }, {
            'title': 'about',
            'link': '/about'
        }];

        $scope.isCollapsed = true;

        $scope.isActive = function(route) {
            return route === $location.path();
        };
    });
