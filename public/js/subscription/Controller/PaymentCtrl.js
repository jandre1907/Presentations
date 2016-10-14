angular.module("Subscription").controller("PaymentCtrl",
["$log", "$scope", "$q", "Normalization", "Cities",
function ($log, $scope, $q, Normalization, Cities)
{
    var vm = this;
    $scope.cro = false;// country read only

    var error = function(msg) {
        $scope.error = msg;
        window.scrollTo(0,0);
    }

/////////////////////////////////Picto rules ////////////////////////////////
    $scope.showValidPicto = function(fieldName)
    {
        var field = $scope.step_form[$scope.fieldNames[fieldName]];

        try{

            return !field.$isEmpty(field.$viewValue) && field.$valid;
        } catch(e) {
            $log.log(e.message)
        }

        return false;
    }

    $scope.showInvalidPicto = function(fieldName)
    {
        var field = $scope.step_form[$scope.fieldNames[fieldName]];

        try{

            return !field.$isEmpty(field.$viewValue) && field.$invalid;
        } catch(e) {
            $log.log(e.message)
        }

        return false;
    }

    $scope.showIbanValidPicto = function()
    {
        var res = true;
        for (var i = 1; i < 8; i++) {
            var fieldName =  'iban' + i + 'Name';
            var field = $scope.step_form[$scope.fieldNames[fieldName]];

            res = res && !field.$isEmpty(field.$viewValue) && field.$valid;
        }

        return res;
    }

    $scope.showIbanInvalidPicto = function()
    {
        var res = false;
        for (var i = 1; i < 8; i++) {
            var fieldName =  'iban' + i + 'Name';
            var field = $scope.step_form[$scope.fieldNames[fieldName]];

            res = res || (!field.$isEmpty(field.$viewValue) && field.$invalid);
        }

        return res;
    }

////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////Message showing rules ////////////////////////////////////////////////
    $scope.showInvalidMessage = function(fieldName)
    {
        try{

            return $scope.showInvalidPicto(fieldName);
        } catch(e) {
            $log.log(e.message)
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
            'fullComplement': function fullComplement(value) {
                if (typeof value != "undefined") {
                    $scope.street2 = value;
                }

                return $scope.street2;
            }
        }
        // if (vm.askedNormalization) {
        Normalization.normalizeAddress(
            $scope,
            function(data) {// normalization asked an pass
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
            error
        );

        return expose.promise;
    };


    $scope.sendTagForm = function(event, element)
    {
        if (!element && event) {
            element = $(event.currentTarget);
        }

        if (!element) {
            return;
        }

        $log.log("profil tagForm");
        //send event
        $scope.$emit("tagFormEvent", {
            "form": {
                "isNotPayer": $scope.isNotPayer == $scope.isNotPayer ? 1 : 0
            },
            "callback": function() {
                element.click();
            }
        });
    };


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
    
    $scope.paymentSubmit = function(event)
    {
        if (!$scope.isNotPayer){
            $scope.sendTagForm(event);
            return;
        }

        var element = $(event.currentTarget);
        event.stopPropagation();
        event.preventDefault();

        doNormalization()
            .then(
                function(data){
                    $log.log("normalization ok, submit form");
                    removePhoneSpaces();
                    $scope.sendTagForm(null, element);
                }
            )
            .catch(function(msg) {
                //$scope.step_form.$setValidity("normalization", false);
                $log.log(msg);
            });
        return false;
    }
}])

