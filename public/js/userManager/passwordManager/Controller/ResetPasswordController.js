angular.module('passwordManager').controller('ResetPasswordController', function($scope) {

    $scope.fieldNameFirst;
    $scope.fieldNameSecond;

    $scope.picName = function(fieldName) {
        return ($scope.step_form[fieldName].$error.passwordFormat ? "error" : "check");
    }

    $scope.submitIsDisabled = function() {
        if ( ! !$scope.password
            && !$scope.step_form[$scope.fieldNameFirst].$error.passwordFormat
            && !$scope.step_form[$scope.fieldNameSecond].$error.passwordFormat
            && ($scope.password == $scope.passwordTwin)
        ) {
            return false;
        }

        return true;
    }
});