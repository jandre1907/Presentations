CX.Controllers.prototype.DetailCtrl = function($scope, $location, $filter, Wording, forcePattern, isDateValid) {

    // Affiche les données de l'écran précédent
    $scope.referenceUnknown  = CX.searchUserSigModel.referenceUnknown;
    $scope.reference         = CX.searchUserSigModel.reference;
    $scope.mail         = CX.searchUserSigModel.email;
    $scope.birthDay     = CX.searchUserSigModel.birthDate_day;
    $scope.birthMonth   = CX.searchUserSigModel.birthDate_month;
    $scope.birthYear    = CX.searchUserSigModel.birthDate_year;
    $scope.password     = CX.searchUserSigModel.password;
    $scope.birthDate    = $scope.birthYear+"-"+$scope.birthMonth+"-"+$scope.birthDay;

    $scope.useCase;

    $scope.prefix_front = SEL.prefix_front;
    $scope.$watchGroup(
        [
            'rawMobile'
        ],
        function() {
            $scope.rawMobile = $filter('phoneFilter')($scope.rawMobile);
            $scope.mobile = $filter('phoneUnfilter')($scope.rawMobile);

            $scope.detailForm.mobile.$setValidity('phonePrefix',$scope.mobile.length == 10 && ($scope.mobile.substr(0,2) == '07' || $scope.mobile.substr(0,2) == '06'));
            $scope.detailForm.mobile.$setValidity('phonePrefix',$scope.mobile.length == 0 || $scope.detailForm.mobile.$valid);
        }
    );

    $scope.$watch(
        'detailForm',
        function() {
            forcePattern(/^[0-9]*$/, [
                        $scope.detailForm.postalCode,
                        $scope.detailForm.birthDay,
                        $scope.detailForm.birthMonth,
                        $scope.detailForm.birthYear,
                    ],
                    $scope
                );

            forcePattern(/^[a-zA-ZáàâäçéèêëíìîïôöúùûüÿæœÁÀÂÄÇÉÈÊËÍÌÎÏÓÒÔÖÚÙÛÜŸÆŒ\-\ \']*$/, [
                    $scope.detailForm.lastName,
                    $scope.detailForm.firstName
                ],
                $scope
            )
        /***************** override some form functionality ********/
            //save original function
            var isEmptyDateElement = $scope.detailForm.birthDay.$isEmpty;
            //override by new simplier function
            var isEmpty = function() {
                var self = this;
                return isEmptyDateElement(self.$modelValue);
            }
            //override fields with new function
            $scope.detailForm.birthDay.$isEmpty
                = $scope.detailForm.birthMonth.$isEmpty
                = $scope.detailForm.birthYear.$isEmpty
                = isEmpty;

            // if (typeof $scope.detailForm.birthDay.$validators.date != 'function') {
            //     $scope.detailForm.birthDay.$validators.date = $scope.dateIsPermitted;
            // }
        }
    );

    $scope.$watchGroup(['birthDay', 'birthMonth', 'birthYear'],
        function(newValues, oldValues) {
            $scope.detailForm.$setValidity('date', $scope.dateIsPermitted());
        }
    )

    var businessValid = function() {
        var res = true;

        return res;
    };

    $scope.setBirthDate = function() {
        $scope.birthDate = $scope.birthYear + '-' + $scope.birthMonth + '-' + $scope.birthDay; // + 'T00:00:00';
    };


    $scope.setUseCase = function() {
        $scope.useCase = "default";
    };

    var updateUserSelSuccess = function() {
        CX.log("updateUserSelSuccess");
        $location.path("/confirmation_creation_espace");
    };

    var updateUserSelError = function() {
        CX.log("updateUserSelError");
        $scope.error = Wording.get('cpt.cpt_erreur.CU-RAT-EC01-MSS_002');
        $scope.$emit('tagIdentificationErrorEvent');
    };

    var successCreateUserSel = function (data) {
        CX.log("successCreateUserSel");
        $location.path('/confirmation_creation_espace');
        //goto confirmation
    };

    var errorCreateuserSel = function () {
        CX.log("errorCreateuserSel");
        $scope.error = Wording.get('cpt.cpt_erreur.CU-RAT-EC01-MSS_002');
        $scope.$emit('tagIdentificationErrorEvent');
    };

    var searchSigSuccess = function(data) {
        CX.log("searchSuccess");

        // (lv) cas payeur
        if(data.client.length>1){
            // Fait un update est nom un create lors du choix du compte SIG à lier.
            CX.searchUserSigModel.isUpdate = true;
            $location.path("/selection_identite");
            return;
        }

        $scope.reference = data.client[0].reference;
        var exclusionCase = { "Décédé" : true, "Exclu": true, "Doublon":true };
        if(exclusionCase[data.client[0].libelleEtat]) {
            CX.error = 'CU-RAT-EC01-MSS_002';
            $location.path("/echec_identification");
            $scope.error =  Wording.get('cpt.cpt_erreur.CU-RAT-EC01-MSS_002');
            $scope.$emit('tagIdentificationErrorEvent');
        } else {
            try{
                $scope.mailCompte = CX.searchUserSigModel.email;
                var request = new CX.MODEL.createUserSel(successCreateUserSel, errorCreateuserSel, CX.Transformers.createUserSelFromInscription($scope));
                //var request = new CX.MODEL.updateUserSel(updateUserSelSuccess, updateUserSelError, CX.Transformers.updateUserSelFromDetail($scope));
                request.execute();
            } catch(e) {
                $scope.error = Wording.get('cpt.cpt_erreur.CU-RAT-EC01-MSS_001');
                $scope.$emit('tagIdentificationErrorEvent');
            }
        }
    };

    var searchSigError = function(data) {
        if (data.erreur) {
            $location.path('/saisie_donnees_client');
        }
        CX.log("searchError");
        $scope.error = Wording.get('cpt.cpt_erreur.CU-RAT-EC01-MSS_001');
        $scope.$emit('tagIdentificationErrorEvent');
    };

    $scope.gotoStep = function(stepName,options) {

        if (typeof $scope.error == 'undefined' ) {
            $scope.error = Wording.get('cpt.cpt_erreur.CU-RAT-EC01-MSS_002');
            $scope.$emit('tagIdentificationErrorEvent');
        }

        $scope.formSubmitted = true;
        $scope.setUseCase();

        if (formIdentificationIsValid($scope)) {
            if($scope.detailForm.$valid && businessValid()) {
                $scope.error = "";
                //CX.MODEL.saveForm("Formulaire", $scope, $cookieStore);
                switch ($scope.useCase) {
                    default:
                        var request = new CX.MODEL.searchUserSig(searchSigSuccess, searchSigError, CX.Transformers.searchUserSigFromDetail($scope));
                        request.execute();
                }
            }

        }
    };

    $scope.dateIsInvalid = function() {
        return !dateFormatIsValid() || !!getDateError();
    }

    $scope.dateIsValid = function() {
        return dateFormatIsValid() && !!!getDateError();
    }


    var dateFormatIsValid = function() {
        return ($scope.detailForm.birthDay.$valid
                && $scope.detailForm.birthMonth.$valid
                && $scope.detailForm.birthYear.$valid
            ) || ($scope.detailForm.birthDay.$pristine
                && $scope.detailForm.birthMonth.$pristine
                && $scope.detailForm.birthYear.$pristine
            );
    }

    $scope.dateIsPermitted = function()
    {
        //carreful $isEmpty is overrided here
        return ($scope.detailForm.birthDay.$isEmpty()
                && $scope.detailForm.birthMonth.$isEmpty()
                && $scope.detailForm.birthYear.$isEmpty()
            ) || $scope.dateIsValid();
            ;
    }


    /**
     * get Date error
     * @use $scope.birthDay, $scope.birthMonth, $scope.birthYear
     *
     * @return errorMessage or false;
     */
    var getDateError = function ()
    {
        if (!isDateValid.isOlder(4, $scope.birthYear, $scope.birthMonth, $scope.birthDay)) {
            return  Wording.get('cpt.cpt_erreur.CU-DET-EC01-ERR_001'); // "L'abonnement est accessible à l'âge de 4 ans minimum"; // SNA-RAT-EC02-ERR_001 SNA-RAT-EC02-ERR_006
        }

        if (!isDateValid.format($scope.birthYear, $scope.birthMonth, $scope.birthDay)) {
            return  Wording.get('cpt.cpt_erreur.CU-DET-EC01-ERR_002'); //"Erreur dans la saisie de la date de naissance. Merci de la saisir à nouveau."; //  SNA-RAT-EC02-ERR_002 SNA-RAT-EC02-ERR_007
        }

        return false;
    }

    var formIdentificationIsValid = function(scope){
        var dateError = getDateError();

        if (!!dateError) {
            return false;
        }

        if (!scope.referenceUnknown && !$scope.reference) {
            scope.error = "Le numéro client n'est pas renseigné";
            $scope.$emit('tagIdentificationErrorEvent');
            CX.log(scope.error);

            return false;
        }


        return true;
    }
};
