CX.Controllers.prototype.ConfirmationCtrl = function($scope, $location, $http, $sce, $route, $routeParams, $compile, Upload, $q) {

	$scope.mail = CX.searchUserSigModel.email;
	$scope.renewMessage = "";

    $scope.gotoStep = function (stepName, options) {
        CX.log("GOTOSTEP");
        $scope.formSubmitted = true;

        if ( $scope.mail) {
            var request = new CX.MODEL.renewConfirmationEmail(successRenewConfirmationEmail, errorRenewConfirmationEmail,{ "email":     $scope.mail });
            request.execute();
        }

    };

    var successRenewConfirmationEmail = function (data) {
        CX.log("successRenewConfirmationEmail");
        CX.log(data);
        $("#infos_renew").modal()
        //$scope.renewMessage = data.renewMessage;
        //$location.path('/Confirmation');
        //goto confirmation
    };

    var errorRenewConfirmationEmail = function () {
        CX.log("errorRenewConfirmationEmail");
        $scope.error = Wording.get('cpt.cpt_erreur.CU-RAT-EC01-MSS_002');
    };



};
