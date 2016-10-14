CX.Controllers.prototype.VerificationCtrl = function($scope, $location, $http, $q, Wording, Normalization, forcePattern, $rootScope) {
    $scope.errorMessages = Wording.getCategorie('cpt').cpt_erreur;
    $scope.street1 = "";
    $scope.street2 = "";
    $scope.ligne1 = "";
    $scope.ligne4 = "";

    $scope.postalCode = "";
    $scope.country = "France";
    $scope.mobil = "";
    $scope.phone = "";
    $scope.reference = CX.isSig;
    $scope.mail = CX.userMail;
    $scope.dateOfBirth = CX.dateOfBirth;
    $scope.useCase;
    $scope.cities = [];
    $scope.hideForm = true;
    $scope.formSubmitted = false;
    $scope.returnUrl = null;
    $scope.infoBirthDate = "";
    $scope.city = {};
    var adresseInitiale = {};

    CX.$http = $http;

    $scope.$on('$locationChangeSuccess', function(event) {
        forcePattern(/^[0-9]*$/, [$scope.verificationForm.postalCode],$scope);
        forcePattern(/^[0-9 ]*$/, [$scope.verificationForm.mobil, $scope.verificationForm.phoneFix],$scope);
    });

/////////////// watch mobile number and force it to have space and to be compounded by number ////
    var removeSpaces = function(raw)
    {
        if (!raw) {
            return "";
        }

        return raw.split(" ").join("");
    }

    var removePhoneSpaces = function() {
        var phoneField = $scope.verificationForm.phoneFix;
        var mobileField = $scope.verificationForm.mobil;

        phoneField.$viewValue = removeSpaces(phoneField.$viewValue);
        $scope.phone = removeSpaces(phoneField.$viewValue);
        phoneField.$render();

        mobileField.$viewValue = removeSpaces(mobileField.$viewValue);
        $scope.mobil = removeSpaces(mobileField.$viewValue);
        mobileField.$render();

    }

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

    var watched = ['mobil', 'phoneFix'];
    var formatPhone = function (newValues, oldValues, scope)
    {
        for (index in newValues) {
            var fieldName = watched[index];
            var field = $scope.verificationForm[fieldName];

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
                return scope.verificationForm.mobil.$viewValue;
            },
            function(scope) {
                return scope.verificationForm.phoneFix.$viewValue
            }
        ],
        formatPhone
    );
/////////////////////////////////////////////////////////////////////////////////////////////////////

    var displayError = function(msg) {
        window.scrollTo(0,0);
        $scope.error = msg;
    }

    $scope.setBirthDate = function() {
        $scope.birthDate = $scope.birthYear + '-' + $scope.birthMonth + '-' + $scope.birthDay; // + 'T00:00:00';
    }

    $scope.setUseCase = function() {
        $scope.useCase = "default";
        if($scope.reference) {
            $scope.useCase = "isSig";
        }
        // (lv) cette condition etait commenté ?
        if ($location.path()== "/Coordonnees") { // ? no route
            $scope.useCase = "coordonnees";
        }
    }

    $scope.getCities = function(){
        var getCitiesSuccess = function(cityDetail, cities) {
            $scope.verificationForm.$setValidity("city", true);
            $scope.cities = cities;
            $scope.city = $scope.cities[0];
        }

        var getCitiesError = function(cities) {
            $scope.error = Wording.get('sna.sna_erreur.SNA-CO-EC01-MSS_005');
            $scope.verificationForm.$setValidity("city", false);
        }

        //$scope.postalCode = (typeof($scope.postalCode) != "undefined") ? $scope.postalCode : "";
        if ($scope.postalCode && $scope.postalCode.length == 5) {
            var request = new CX.MODEL.getCities(getCitiesSuccess, getCitiesError, CX.Transformers.getCitiesFromVerification($scope));
            request.execute();
        } else {
            $scope.verificationForm.$setValidity("city", false);
            $scope.cities = [];
        }
    };

    {
        var searchUserSigSuccess = function(searchResult) {
            var userSig = searchResult['client'][0];

            $scope.hideForm = false;
            adresseInitiale = userSig;

            $scope.street1    = userSig.adresse.ligne3;
            $scope.street2    = userSig.adresse.ligne2;
            $scope.ligne1     = userSig.adresse.ligne1;
            $scope.ligne4     = userSig.adresse.ligne4;
            $scope.postalCode = userSig.adresse.codePostal;
            if (userSig.pays != '') {
                $scope.country = userSig.pays;
            } // else France by default in $scope

            $scope.npai       = userSig.nPAI;
            $scope.birthDate  = userSig.birthDate;
            $scope.mobil      = userSig.telephoneMobile;
            $scope.phone      = userSig.adresse.telephone;
            $scope.firstName  = userSig.prenom;
            $scope.lastName   = userSig.nom;
            $scope.title      = userSig.civilite;
            $scope.codeInseeCommune   = userSig.adresse.codeInseeCommune;

            d = new Date(userSig.dateNaissance);
            $scope.infoBirthDate = {
                "day": d.getDate() < 10 ? "0" + d.getDate() : "" + d.getDate(),
                "month": d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : "" + (d.getMonth() + 1),
                "year": "" + d.getFullYear()
            }

            userSig.adresse.libelle = userSig.adresse.bureauDistributeur;
            userSig.adresse.label = userSig.adresse.libelle;
            $scope.cities = [];
            $scope.cities.push(userSig.adresse);
            $scope.city = $scope.cities[0];

        };

        var searchUserSigError = function() {
            $scope.hideForm = true;
            CX.log("searchUserSigError");
        };
    }

    var updateUserAddressSelSuccess = function(code, msg) {
        if ( $scope.returnUrl ) {

            // $location.path($scope.returnUrl);
            window.location = ( $scope.returnUrl );
        } else {
            window.location.pathname += ("/../../espace_client");
        }
    };

    var updateUserAddressSelError = function() {
        CX.log("updateUserUserAddressSelError");
    };

    var updateSigSuccess = function() {
        CX.log("updateSigSuccess !");
        var request = new CX.MODEL.updateUserAddressSel(updateUserAddressSelSuccess, updateUserAddressSelError, CX.Transformers.updateUserAddressSelFromVerification($scope));
        request.execute();

    };

    var updateSigError = function() {
        CX.log("updateSigError");
    };

    var callSearchUserAndSave = function() {
        var requestUserSigUpdate = new CX.MODEL.searchUserAndSave(updateSigSuccess, updateSigError, CX.Transformers.searchUserAndSaveFromVerification($scope));
        requestUserSigUpdate.execute();
        return;
    }

    var callUpdateUserAddressSel = function() {
        var request = new CX.MODEL.updateUserAddressSel(updateUserAddressSelSuccess, updateUserAddressSelError, CX.Transformers.updateUserAddressSelFromVerification($scope));
        request.execute();
    }

    var goToStepSuccessIsSig = function() {
        //callSearchUserAndSave();
        //callUpdateUserAddressSel();
    }

    var addressHasChanged = function() {
        return ($scope.street1   != adresseInitiale.ligne3
            || $scope.street2    != adresseInitiale.ligne2
            || $scope.ligne1     != adresseInitiale.ligne1
            || $scope.ligne4     != adresseInitiale.ligne4
            || $scope.postalCode != adresseInitiale.codePostal
            || $scope.country    != adresseInitiale.pays
            || $scope.codeInseeCommune          != adresseInitiale.codeInseeCommune
            || $scope.phone.split(' ').join('') != adresseInitiale.telephone.split(' ').join('')
        );
    }

    var displayNpaiPopinAndWaitAction = function() {
        var expose = $q.defer();

        var confirmAction = function() {
            expose.resolve();
        }

        var cancelAction = function() {
            expose.reject();
        }

        if (addressHasChanged() || !$scope.npai) {
            setTimeout(confirmAction, 10);

            return expose.promise;
        }

        $rootScope.displayNpaiPopin(
            confirmAction,
            cancelAction
        );

        return expose.promise;
    }

    var goToStepSuccessDefault = function() {
        displayNpaiPopinAndWaitAction().then(
            function() {
                removePhoneSpaces();
                callUpdateUserAddressSel();
            }
        )
    }

    var goToStepError = function() {
        return false;
    }

    $scope.gotoStep = function(stepName,options) {
        $scope.formSubmitted = true;
        $scope.returnUrl = options && options.url ? options.url : "";
        $scope.setUseCase();

        if ($scope.verificationForm.$valid) {
            $scope.error = "";

            var addressDataMapper = {
                line3: function(line3) {
                    if (typeof line3 != 'undefined') {
                        $scope.street1 = line3;
                    }
                    return $scope.street1;
                },
                line2: function(line2) {
                    if (typeof line2 != 'undefined') {
                        $scope.street2 = line2;
                    }
                    return $scope.street2;
                },
                line1: function(line1) {
                    if (typeof line1 != 'undefined') {
                        $scope.ligne1 = line1;
                    }
                    return $scope.ligne1;
                },
                zipCode: function(zipCode) {
                    if (typeof zipCode != 'undefined') {
                        $scope.postalCode = zipCode;
                    }
                    return $scope.postalCode;
                },
                distributionOffice: function(distributionOffice) {
                    if (typeof distributionOffice != 'undefined') {
                        $scope.city.bureauDistributeur = distributionOffice;
                    }
                    return $scope.city.bureauDistributeur;
                },
                cityInseeCode: function(cityInseeCode) {
                    if (typeof cityInseeCode != 'undefined') {
                        $scope.city.codeInseeCommune = cityInseeCode;
                    }
                    return $scope.city.codeInseeCommune;
                },
                line4: function(line4) {
                    if (typeof line4 != 'undefined') {
                        $scope.ligne4 = line4;
                    }
                    return $scope.ligne4;
                },
                country: function(country) {
                    if (typeof country != 'undefined') {
                        $scope.country = country;
                    }
                    return $scope.country;
                },
                fullComplement: function(fullComplement) {
                    if (typeof fullComplement != 'undefined') {
                        $scope.street2 = fullComplement ;
                    }
                    return $scope.street2;
                } // fullComplement is necessarily the last key
            };

            switch ($scope.useCase) {
                case "isSig":
                    Normalization.normalizeAddress(
                        $scope,
                        goToStepSuccessDefault,
                        goToStepError,
                        addressDataMapper,
                        null,
                        displayError
                    );
                    break;
                default:
                    Normalization.normalizeAddress(
                        $scope,
                        goToStepSuccessDefault,
                        goToStepError,
                        addressDataMapper,
                        null,
                        displayError

                    );
            }
        }
    };
};