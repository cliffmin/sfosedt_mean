'use strict';

angular.module('fullstackApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.message = 'Hello';
         $('#aboutImage').backstretch('../../assets/images/curiosity.jpg');
  });
