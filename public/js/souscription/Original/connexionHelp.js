SEL.App.prototype.ConnexionHelpCtrl = function ($scope, $location, $http, $sce, $route,$routeParams, $compile, Upload, $q, $cookieStore) {

    this.$route = $route;
    this.$location = $location;
    //this.$routeParams = $routeParams;
    $scope.toggle;

    var initCtrl = function() {

      $scope.error = null;

      $scope.toggle = 1;


    }


    initCtrl();

    $scope.gotoStep = function(stepName) {
        //SEL.MODEL.saveDataToCookie();
      $location.path(stepName);
    }
}

/**************MODEL*********************************************************************************/
/** IdentificationHelp **********************************************************************************/
