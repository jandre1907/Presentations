angular.module("Subscription").controller("PostalCtrl",
["$log", "$scope", "$q", "$http", "$location", "Normalization", "Cities", "isDateValid", "forcePattern",
function ($log, $scope, $q, $http, $location, Normalization, Cities, isDateValid, forcePattern)
{
    var vm = this;
    $scope.cro = true;
    $scope.isNotPayer = true;
    $scope.cities = [];
    $scope.city = {
        'bureauDistributeur': ""
    };
    $scope.bureauDistributeur = "";
    $scope.cities.push($scope.city);

    var error = function(msg) {
        $scope.error = msg;
        window.scrollTo(0,0);
    }

    $scope.requireDate = function() {
       return true;
    }
////////////////// privates //////////////////////////////////////////

    /**
     * fill input field like phone number
     * @param field formField
     * @param newValue current viewValue of the field
     */
    var addSpace = function(field, newValue)
    {
        if ((newValue.length + 1) % 3 == 0){
            field.$setViewValue(newValue + " ");
            field.$render();
        }
    }

    /**
     * force input field have uniquely phone number string
     * @param field formField
     * @param newValue current viewValue of the field
     */
    var forceMobileNumber = function(field, newValue)
    {
        var regex = /^([0-9]{1,2}[ ]?)*$/;

        if (!regex.test(newValue)) {
            newValue = newValue.substr(0, newValue.length - 1);
            field.$setViewValue(newValue);
            field.$render();
        }
    }

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

    $scope.isEmailFormatInvalid = function(fieldName)
    {
        try {

            return $scope.step_form[$scope.fieldNames[fieldName]].$error.email;
        } catch(e) {
            $log.log();
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

///////////////////////////// Normalization ///////////////////////////////////
    var doNormalization = function(data)
    {
        var expose = $q.defer();
        var dataMapper = {
            'line4': function line4(value) {
                if (typeof value != "undefined") {
                    $scope.ligne4 = value;
                }

                return $scope.ligne4;
            },
            'line3': function line3(value) {
                if (typeof value != "undefined") {
                    $scope.ligne3 = value;
                }

                return $scope.ligne3;
            },
            'line2': function line2(value) {
                if (typeof value != "undefined") {
                    $scope.ligne2 = value;
                }

                return $scope.ligne2;
            },
            'line1': function line1(value) {
                if (typeof value != "undefined") {
                    $scope.ligne1 = value;
                }

                return $scope.ligne1;
            },
            'zipCode': function zipCode(value) {
                if (typeof value != "undefined") {
                    $scope.postalCode = value;
                }

                return $scope.postalCode;
            },
            'distributionOffice': function distributionOffice(value) {
                if (typeof value != "undefined") {
                    $scope.city.bureauDistributeur = value;
                }

                return $scope.city.bureauDistributeur;
            },
            'cityInseeCode': function cityInseeCode(value) {
                if (typeof value != "undefined") {
                    $scope.codeInseeCommune = value;
                }

                return $scope.codeInseeCommune;
            },
            'country': function country(value) {
                if (typeof value != "undefined") {
                    $scope.country = value;
                }

                return $scope.country;
            },
            'fullComplement': function fullComplement(line2, line1, line4) {
                if (typeof line2 != "undefined") {
                    $scope.ligne2 = line2;
                }

                if (typeof line1 != "undefined") {
                    $scope.ligne1 = line1;
                }

                if (typeof line4 != "undefined") {
                    $scope.ligne4 = line4;
                }


            }
        }
        // if (vm.askedNormalization) {
        Normalization.normalizeAddress(
            $scope,
            function(data) {// normalization asked an pass
                // vm.askedNormalization = false;
                expose.resolve(data);
            },
            function(data) {
                $log.log("erreur du service de normalisation");
                expose.reject({
                    "msg": "erreur du service de normalisation",
                    "code": 2
                });
            },
            dataMapper,
            null,
            function(response) {// normalization asked but canceled
                error(response);
            }
        );

        return expose.promise;
    };
/////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////// SUBMIT ////////////////////////////////////////////////
    var removeSpaces = function(raw)
    {
        if (!raw) {
            return "";
        }

        return raw.split(" ").join("");
    }

    var removePhoneSpaces = function() {
        var phoneField = $scope.step_form[$scope.fieldNames['phoneFixName']];
        var mobileField = $scope.step_form[$scope.fieldNames['mobileName']];

        phoneField.$viewValue = removeSpaces(phoneField.$viewValue);
        phoneField.$render();

        mobileField.$viewValue = removeSpaces(mobileField.$viewValue);
        mobileField.$render();
    }

    $scope.postalSubmit = function(event)
    {
        var element = $(event.currentTarget);
        event.stopPropagation();
        event.preventDefault();

        doNormalization()

        .then(function(data){
            $log.log("normalization ok, submit form");
            removePhoneSpaces();
            element.click();
        })
        .catch(function(msg) {
            $scope.step_form.$setValidity("normalization", false);
            $log.log(msg);
            });

        return false;
    }

}])

