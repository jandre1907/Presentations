angular.module('passwordManager').controller('PasswordController', function($scope) {

    $scope.currentFieldIsPresent = true;
    $scope.passField1 = false;
    $scope.passField2 = false;
    $scope.passField3 = false;
    $scope.btnState = true;
    // ---- Regex format rules for password ----
    var UPCASE_REGEXP = /^.*[A-Z]+.*$/;
    var INTEGER_REGEXP = /^.*[0-9]+.*$/;
    var LOWERCASE_REGEXP = /^.*[a-z]+.*$/;
    // ---- Check current password field format ----
    $scope.currentPasswordIsValid = function() {
            if ($scope.current_password != null
                && UPCASE_REGEXP.test($scope.current_password)
                && INTEGER_REGEXP.test($scope.current_password)
                && LOWERCASE_REGEXP.test($scope.current_password)) {
                $scope.picname="check";
                $scope.passField1 = true;
                btnDisabled();
                return true;
            } else if($scope.current_password != null
                && !(UPCASE_REGEXP.test($scope.current_password)
                && INTEGER_REGEXP.test($scope.current_password)
                && LOWERCASE_REGEXP.test($scope.current_password))) {
                $scope.picname="error";
                $scope.passField1 = false;
                btnDisabled();
                return true;
            }
        btnDisabled();
        $scope.picname="error";
        $scope.passField1 = false;

        return false;
    }
    // ---- Check password field format ----
    $scope.passwordIsValid = function() {
        if ($scope.password != null &&
            UPCASE_REGEXP.test($scope.password) &&
            INTEGER_REGEXP.test($scope.password) &&
            LOWERCASE_REGEXP.test($scope.password)
        ) {
            $scope.picname2="check";
            $scope.passField2 = true;
            btnDisabled();
            return true;
        } else if($scope.password != null
            && !(UPCASE_REGEXP.test($scope.password)
            && INTEGER_REGEXP.test($scope.password)
            && LOWERCASE_REGEXP.test($scope.password))) {
            $scope.picname2="error";
            $scope.passField2 = false;
            btnDisabled();
            return true;
        }
        $scope.picname2="error";
        btnDisabled();
        $scope.passField2 = false;
        return false;
    }
    // ---- Check password twin field format ----
    $scope.passwordTwinIsValid = function() {
        if ($scope.passwordTwin != null
            && UPCASE_REGEXP.test($scope.passwordTwin)
            && INTEGER_REGEXP.test($scope.passwordTwin)
            && LOWERCASE_REGEXP.test($scope.passwordTwin)
            && $scope.passwordTwin == $scope.password
        ) {
            $scope.picname3="check";
            $scope.passField3 = true;
            btnDisabled();
            return true;
        } else if($scope.passwordTwin != null) {
            $scope.picname3="error";
            $scope.passField3 = false;
            btnDisabled();
            return true;
        }
        $scope.picname3="error";
        $scope.passField3 = false;
        btnDisabled();
        return false;
    }
    // ---- enable submit btn if all input fields is conformed ----
    function btnDisabled() {
        if ($scope.currentFieldIsPresent == true) {
            if ($scope.passField1 && $scope.passField2 && $scope.passField3) {
                $scope.btnState =  false;
            } else {
                $scope.btnState =  true;
            }
        } else {
            if ($scope.passField2 && $scope.passField3) {
                $scope.btnState =  false;
            } else {
                $scope.btnState =  true;
            }
        }



    }
});