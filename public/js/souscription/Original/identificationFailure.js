SEL.App.prototype.IdentificationFailureCtrl = function ($scope, $io, $location, $http, $sce, $route,$routeParams, $compile, Upload, $q, $cookieStore, $rootScope) {

    this.mesKey = "vide";

    var resetCtrl = function() {
        vm.meskey = SEL.objects.userInfo.errorMessageKey;
    };

	$scope.$on('$viewContentLoaded', function(event) {
	    resetCtrl();
	  });
}


