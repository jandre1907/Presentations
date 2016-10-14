angular.module("Subscription").controller("SignatureCtrl", ["$log", "$scope", "$http", function ($log, $scope, $http) {

    var vm = this;

    var initCtrl = function () {
        $scope.disableSubmit = true;
        $scope.cgvAccepted = false;
        $scope.attempNumber = 3;
        $scope.otpSendedTwice = false;
        $scope.errorMessages = Wording.getCategorie('sna').sna_erreur;

        $rootScope.$broadcast("receiveResponse");
    };

    var disableSubmit = function() {
        $scope.disableSubmit = true;
    };

    var enableSubmit = function() {
        $scope.disableSubmit = false;
    };

    $scope.$on('$viewContentLoaded', function (event) {
        initCtrl();
    });

    $scope.submitForm = function($event) {
    	$event.stopPropagation();
    	$event.preventDefault();
    	document.step_form.submit();
    };


    /**
     * set master signatureCGV = true | false
     *
     */
    $scope.acceptCGV = function() {
        $scope.cgvAccepted = !$scope.cgvAccepted;
    };

    var error = function(msg){
        $scope.error = msg || $scope.errorMessages['SNA-CO-EC01-ERR_008'];
    };

    $scope.getSmsOtp = function() {
        var success = function (data) {
        	$scope.attemptNumber = data["attemptNumber"];
        };

        var error = function (data) {
            $scope.error = "erreur à l'envoi du code";
        };

        vm.httpGet($scope.prefix_front + "api/contralia/otp/sms.json", {"token": $scope.token}, success, error);
    };

    $scope.getPayerEmailOtp = function() {
        var success = function (data) {
            $scope.attemptNumber = data["attemptNumber"];
            //$scope.cart.otpMethod = "email";
        };

        var error = function (data) {
            $scope.error = "erreur à l'envoi du code";
        };
        vm.httpGet($scope.prefix_front + "api/contralia/otp/email.json", {"token": $scope.token}, success, error);
    };

    vm.httpGet = function(url, param, success, error) {
        $http
            .get(url,
                {
                    "params": param,
                    "responseType": "json"
                }
            )
            .success(success)
            .error(error || SEL.MODEL.defaultError);
    };

}]);






