angular.module("Subscription").directive("person",
["$log", "$q", "$http", "$location", "Normalization", "Cities", "isDateValid", "forcePattern",
function ($log, $q, $http, $location, Normalization, Cities, isDateValid, forcePattern)
{
    var vm = this;

    return {
        'templateUrl': 'person.id',
        'restrict': 'A',
        link: function ($scope, element, attrs)
        {
            $scope.step_form.$setValidity('dateFormat', true);

            $scope.$on("$locationChangeSuccess", function(){
                initCities();
            })

            $scope.isPersonRequired = function() {
                return $scope.isNotPayer;
            }

            $scope.requireDate = function() {
               return $scope.isPersonRequired();
            }

            var init = function()
            {
                $scope.$watch('step_form[fieldNames["postalCodeName"]].$viewValue', $scope.getCities);

                forcePattern(/^[0-9]*$/, [
                        $scope.step_form[$scope.fieldNames['dayName']],
                        $scope.step_form[$scope.fieldNames['monthName']],
                        $scope.step_form[$scope.fieldNames['yearName']],
                        $scope.step_form[$scope.fieldNames['postalCodeName']]
                    ],
                    $scope
                );

                forcePattern(/^[a-zA-ZáàâäçéèêëíìîïôöúùûüÿæœÁÀÂÄÇÉÈÊËÍÌÎÏÓÒÔÖÚÙÛÜŸÆŒ\-\ \']*$/, [
                        $scope.step_form[$scope.fieldNames['firstnameName']],
                        $scope.step_form[$scope.fieldNames['lastnameName']]
                    ],
                    $scope
                );
            }


        //////// watch fields and force number//////////////////////////////




        /////////////// watch mobile number and force it to have space and to be compounded by number ////
            var watched = ['mobileName', 'phoneFixName'];
            var formatPhone = function (newValues, oldValues, scope)
            {
                for (index in newValues) {
                    var fieldNameKey = watched[index];
                    var fieldName = $scope.fieldNames[fieldNameKey];
                    var field = $scope.step_form[fieldName];

                    newValue = field.$isEmpty(newValues[index]) ? "" : newValues[index];
                    oldValue = field.$isEmpty(oldValues[index]) ? "" : oldValues[index];

                    if (newValue.length > oldValue.length
                        || (newValue.length == oldValue.length
                            && newValue.length == 10
                        )
                    ) {
                        addSpace(field, newValue);
                        forceMobileNumber(field, newValue);
                    }
                }

            }

            $scope.$watchGroup([
                    function(scope) {
                        return scope.step_form[scope.fieldNames['mobileName']].$viewValue;
                    },
                    function(scope) {
                        return scope.step_form[scope.fieldNames['phoneFixName']].$viewValue
                    }
                ],
                formatPhone
            );
        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////// privates //////////////////////////////////////////

            /**
             * fill input field like phone number
             * @param field formField
             * @param newValue current viewValue of the field
             */
            var addSpace = function(field, newValue)
            {
                var compose = "";
                var trim = newValue.split(" ").join("");

                for(var i = 0; i< trim.length; i++ ) {
                    compose += trim[i];
                    if ((compose.length + 1) % 3 == 0) {
                        compose += " ";
                    }
                }

                field.$setViewValue(compose);
                field.$render();
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

            $scope.showValidDatePicto = function()
            {
                var fieldDay   = $scope.step_form[$scope.fieldNames['dayName']];
                var fieldMonth = $scope.step_form[$scope.fieldNames['monthName']];
                var fieldYear  = $scope.step_form[$scope.fieldNames['yearName']];

                try {

                    if (!fieldDay.$isEmpty(fieldDay.$viewValue)
                        && !fieldMonth.$isEmpty(fieldMonth.$viewValue)
                        && !fieldYear.$isEmpty(fieldYear.$viewValue)
                        && fieldDay.$valid
                        && fieldMonth.$valid
                        && fieldYear.$valid
                        && isDateValid.business.cmc(fieldYear.$viewValue,
                            fieldMonth.$viewValue,
                            fieldDay.$viewValue)
                    ) {
                        $scope.step_form.$setValidity('dateFormat', true);

                        return true;
                    }
                } catch(e) {
                    $log.log(e.message)
                }

                return false;
            }

            $scope.showInvalidDatePicto = function(fieldName)
            {
                var fieldDay   = $scope.step_form[$scope.fieldNames['dayName']];
                var fieldMonth = $scope.step_form[$scope.fieldNames['monthName']];
                var fieldYear  = $scope.step_form[$scope.fieldNames['yearName']];

                try {
                    if (!fieldDay.$isEmpty(fieldDay.$viewValue)
                        && !fieldMonth.$isEmpty(fieldMonth.$viewValue)
                        && !fieldYear.$isEmpty(fieldYear.$viewValue)
                        && (   !fieldDay.$valid
                            || !fieldMonth.$valid
                            || !fieldYear.$valid
                            || !isDateValid.business.cmc(fieldYear.$viewValue,
                                    fieldMonth.$viewValue,
                                    fieldDay.$viewValue)
                        )
                    ) {
                        $scope.step_form.$setValidity('dateFormat', false);

                        return true;
                    }
                } catch(e) {
                    $log.log(e);
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



        /////////////////////////////////// City corner ////////////////////////////////
            var resetCities = function() {
                $scope.city = {
                    'codeInseeCommune':'',
                    'bureauDistributeur':''
                }
                $scope.cities = [];
                $scope.bureauDistributeur = "";
                $scope.codeInseeCommune = "";
                $scope.cities.push($scope.city);
            }

            var initCities = function() {
                $scope.cities = [];
                $scope.city = {
                    "bureauDistributeur" : (typeof $scope.city == "string") ? ($scope.city + ""): "",
                    "codeInseeCommune": $scope.codeInseeCommune
                };
                $scope.cities.push($scope.city);
            };

            $scope.getCities = function(newValue, oldValue) {
                if (newValue == oldValue) {
                    return;
                }
                var postalCodeFieldName = $scope.fieldNames['postalCodeName'];
                var sourceField = $scope.step_form[postalCodeFieldName];

                Cities.getCities(
                    function successCities(cities){
                        $scope.postalCodeUnknown = false;
                        $scope.cities = cities;
                        $scope.city = $scope.cities[0];
                        $scope.bureauDistributeur = $scope.city.bureauDistributeur;
                        $scope.codeInseeCommune = $scope.city.codeInseeCommune;
                    },
                    function errorCities(msg){
                        $log.log(msg);
                        $scope.postalCodeUnknown = true;
                        resetCities();
                    },
                    initCities,
                    resetCities,
                    sourceField
                );
            }
        ///////////////////////////////////////////////////////////////////////////////

            init();

        }
    }
}])

