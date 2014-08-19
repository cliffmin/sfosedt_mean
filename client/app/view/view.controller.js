'use strict';



var dataURL = 'api/data';


angular.module('fullstackApp')
    .controller('ViewCtrl', function($scope) {
        $scope.message = 'Hello';
        $scope.sfosData = formatStringIntoHtml(dataURL);


        function formatStringIntoHtml(dataURL) {
            $.getJSON(dataURL).done(function(d) {
                var dataArray = d.jsonData.sfosFile;
                console.log(dataArray);
                var returnHtmlString = '';
                for (var i = 0; i < dataArray.length; i++) {
                    returnHtmlString += (dataArray[i] + ' <br> ')
                }
                document.getElementById('file').innerHTML = returnHtmlString;
            })
        }
    });
