angular.module("Subscription").controller("AccountCreationCtrl",
["$log", "$scope", "$q", "$http",
function ($log, $scope, $q, $http)
{
    var vm = this;

    var error = function(msg) {
        $scope.error = msg;
        window.scrollTo(0,0);
    }

 
////////////////// privates //////////////////////////////////////////

 

/////////////////////////////////Picto rules ////////////////////////////////
    $scope.showValidPicto = function(fieldName)
    {
        var field = $scope.step_form[$scope.fieldNames[fieldName]];

        try{

            return !field.$isEmpty(field.$viewValue) && field.$valid;
        } catch(e) {
            $log.log(e.message);
        }

        return false;
    }

    $scope.showInvalidPicto = function(fieldName)
    {
        var field = $scope.step_form[$scope.fieldNames[fieldName]];

        try{

            return !field.$isEmpty(field.$viewValue) && field.$invalid;
        } catch(e) {
            $log.log(e.message);
        }

        return false;
    }
////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////Message showing rules ////////////////////////////////////////////////
    $scope.showInvalidMessage = function(fieldName)
    {
        try{

            return $scope.showInvalidPicto(fieldName);
        } catch(e) {
            $log.log(e.message);
        }

        return false;
    }

    $scope.areNotEqual = function(fieldName)
    {
        try {

            return $scope.step_form[$scope.fieldNames[fieldName]].$error.equality;
        } catch(e) {
            $log.log(e);
        }

        return false;
    }


    $scope.isPasswordFormatInvalid = function(fieldName)
    {
        try {

            return $scope.step_form[$scope.fieldNames[fieldName]].$error.passwordFormat;
        } catch(e) {
            $log.log(e);
        }

        return false;
    }

    $scope.isPasswordSizeInvalid = function(fieldName)
    {
        try {

            return $scope.step_form[$scope.fieldNames[fieldName]].$error.minlength || $scope.step_form[$scope.fieldNames[fieldName]].$error.maxlength;
        } catch(e) {
            $log.log(e);
        }

        return false;
    }

    $scope.isRequiredInvalid = function(fieldName)
    {
        try{

            return $scope.step_form[$scope.fieldNames[fieldName]].$dirty
                && $scope.step_form[$scope.fieldNames[fieldName]].$error.required;
        } catch(e) {
            $log.log(e);
        }

        return false;
    }
//////////////////////////////////////////////////////////////////////



////////////////////////////////// SUBMIT ////////////////////////////////////////////////
 

    $scope.accountCreationSubmit = function(event)
    {
        var element = $(event.currentTarget);
        event.stopPropagation();
        event.preventDefault();
        element.click();
      
        return false;
    }

}])

