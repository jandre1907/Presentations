angular.module('connexion').controller('PasswordManagerController', [
'$scope', '$log',
function($scope, $log) {

    $scope.isRequiredInvalid = function(fieldName)
    {
        try{
            return $scope.form[fieldName].$dirty
                && $scope.form[fieldName].$error.required;
        } catch(e) {
            $log.log(e);
        }

        return false;
    };

    $scope.areNotEqual = function(fieldName)
    {
        try {
            return $scope.form[fieldName].$error.equality;
        } catch(e) {
            $log.log(e);
        }

        return false;
    };

    $scope.isEmailFormatInvalid = function(fieldName)
    {
        try {
            return $scope.form[fieldName].$error.email;
        } catch(e) {
            $log.log();
        }

        return false;
    };

}]);



