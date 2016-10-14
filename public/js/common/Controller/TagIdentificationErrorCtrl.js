angular.module("Common").controller('TagIdentificationErrorCtrl', [
'$scope', '$rootScope', '$location', '$log', '$http',
function($scope, $rootScope, $location, $log, $http) {
    $scope.url = '#';


    window.xtsite =  $scope.xtsite;
    window.xtn2 =    $scope.xtn2;
    window.xt_multc = $scope.xt_mult;
    window.xt_ac =   $scope.xt_ac;
    window.xt_an =   $scope.xt_an;
    window.xtpage = $scope.xtpage;

    $rootScope.$on("tagIdentificationErrorEvent", function() {
        $log.log("receive tagIdentificationError");

        $scope.url = window.xtsd + '.xiti.com/hit.xiti?s=' + $scope.xtsite
        + '&s2=' + $scope.xtn2
        + '&p=' + $scope.xtpage
        + '&vrn=1' + $scope.xt_multc
        + '&ac=' + $scope.xt_ac
        + '&an=' + $scope.xt_an
        + '&lng=fr'
        + '&idp=' + $scope.sessionId
        + '&ref=' +$scope.referer;

        $log.log($scope.url);
    });

}]);
