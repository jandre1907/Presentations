// useless ?
CX.Controllers.prototype.CoordonneesCtrl = function ($scope, $location, $http, $sce, $route,$routeParams, $compile, Upload, $q) {

    this.$route = $route;
    this.$location = $location;
    //this.$routeParams = $routeParams;

    $scope.error = null;

    var updateUserAddressSelSuccess = function(code, msg) {
        CX.log("updateUserUserAddressSelSuccess");
        if (0 == code && msg == "Success") {
            window.location.pathname += ("/../../espace_client");
        }

    }

    var updateUserAddressSelError = function() {
        CX.log("updateUserUserAddressSelError");
    }
    $scope.gotoUrl = function(url) {

    }
}