angular.module("Common").controller('TagPhotoErrorCtrl', [
'$scope', '$rootScope', '$location', '$log', '$http',
function($scope, $rootScope, $location, $log, $http) {
    $scope.url = '#';


    window.xtsite =  $scope.xtsite;
    window.xtn2 =    $scope.xtn2;
    window.xt_multc = $scope.xt_mult;
    window.xt_ac =   $scope.xt_ac;
    window.xt_an =   $scope.xt_an;
    window.xtpage = $scope.xtpage;

    var errorCodes =  {
        0:'extension_fichier',
        1:'dimension_largeur',
        2:'dimension_hauteur',
        3:'poids_fichier_max',
        4:'poids_fichier_min',
    };

    var getXtPage = function(scope, errorCode) {
        if (!errorCodes[errorCode]) {
            return scope.xtpage + "inconnue";
        }
        return scope.xtpage + errorCodes[errorCode];
    }

    $rootScope.$on("tagErrorPhotoEvent", function(event, data) {
        $log.log("receive tagErrorPhoto");
        $log.log(data.expression);

        $scope.url = window.xtsd + '.xiti.com/hit.xiti?s=' + $scope.xtsite
        + '&s2=' + $scope.xtn2
        + '&p=' + getXtPage($scope, data.expression)
        + '&vrn=1' + $scope.xt_multc
        + '&ac=' + $scope.xt_ac
        + '&an=' + $scope.xt_an
        + '&lng=fr'
        + '&idp=' + $scope.sessionId
        + '&ref=' +$scope.referer;

        $log.log($scope.url);
    });

}]);
