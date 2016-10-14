CX.Controllers.prototype.ConnexionHelpCtrl = function ($scope, $location, $http, $sce, $route,$routeParams, $compile, Upload, $q, $filter, Wording) {

    this.$route = $route;
    this.$location = $location;
    //this.$routeParams = $routeParams;
    $scope.toggle;
    $scope.error = null;
    $scope.toggle = 1;

    $scope.gotoStep = function(stepName) {
      $location.path(stepName);
    }
}