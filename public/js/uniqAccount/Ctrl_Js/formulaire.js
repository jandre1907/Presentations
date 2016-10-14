CX.Controllers.prototype.FormulaireCtrl = function ($scope, $location, $http, $q, Wording, $rootScope, isDateValid) {

    $scope.password = "";
    $scope.passwordConf = "";
    $scope.mail = "";
    $scope.errorMessages = Wording.getCategorie('cpt').cpt_erreur;
    $scope.passEquals = true;
    $scope.days = CX.initArray(1, 31);
    $scope.months = CX.initArray(1, 12);
    $scope.years = CX.initArray(1890, 1900 + (new Date()).getYear());
    $scope.birthDate, $scope.birthYear, $scope.birthMonth, $scope.birthDay;
    $scope.hasCard = 1;
    $scope.reference;
    $scope.referenceUnknown;
    $scope.captchaResponse;
    $scope.useCase;
    $scope.cgv = false;

    var delay = 50;

    $scope.setCaptchaResponse = function (response) {

        try {
            CX.searchUserSigModel.captchaResponse = response;
            $scope.captchaResponse = response;

        } catch (e) {
            CX.log(e);
            // $scope.captchaResponse = "";
            // grecaptcha.reset();
        }
    };

    $scope.$on('$viewContentLoaded', function (event) {

        CX.log("content loaded, FormulaireCtrl ok");
        timer = setInterval(function() {
            if (!window.grecaptcha || !window.grecaptcha.reset || !window.grecaptcha.render) {
                return;
            }
            window.clearInterval(timer);
            try {
                if (CX.captchaId) {
                    grecaptcha.reset(CX.captchaId);
                }


                CX.captchaId = grecaptcha.render('g-recaptcha', {
                    'sitekey': CX.secretCaptcha,
                    'callback': $scope.setCaptchaResponse,
                    'expired-callback': $scope.setCaptchaResponse
                });            // delay = 3000;
            } catch (e) {
                CX.log(e);
                // delay = 50;
            }
        }, 60);

        var loaded = null;
    });


    $scope.setBirthDate = function () {
        $scope.birthDate = $scope.birthYear + '-' + $scope.birthMonth + '-' + $scope.birthDay; // + 'T00:00:00';
    };

    $scope.clear = function (field) {
        setTimeout(function () {
            $scope[field] = null;
        }, 800);

    };

    $scope.setUseCase = function () {

        if ($scope.useCase != "continue") {
            $scope.useCase = $scope.hasCard == 1 ? "searchByReferenceAndBirthday" : null;
            $scope.useCase = $scope.referenceUnknown && $scope.hasCard == 1 ? "searchComplement" : $scope.useCase;
    	}
        if ($scope.referenceUnknown == true) {$scope.reference = ''};

    };

    var successCreateUserSel = function (data) {
        CX.log("successCreateUserSel");
        $rootScope.$broadcast("receiveResponse");
        $location.path('/confirmation_creation_espace');
        //goto confirmation
    };

    // var successCreateUserSelDetail = function (data) {

    //     CX.searchUserSigModel.referenceUnknown         = $scope.referenceUnknown;
    //     CX.searchUserSigModel.reference     = $scope.reference;
    //     CX.searchUserSigModel.email         = $scope.mail;
    //     CX.searchUserSigModel.password      = $scope.password;
    //     CX.searchUserSigModel.birthDate_day = $scope.birthDay;
    //     CX.searchUserSigModel.birthDate_month   = $scope.birthMonth;
    //     CX.searchUserSigModel.birthDate_year    = $scope.birthYear;


    //     CX.log("successCreateUserSelDetail");
    //     $rootScope.$broadcast("receiveResponse");
    //     $location.path('/donnees_complementaires');

    // };

    var errorCreateuserSel = function () {
        CX.log("errorCreateuserSel");
        $rootScope.$broadcast("receiveResponse");
        $scope.error = Wording.get('cpt.cpt_erreur.CU-RAT-EC01-MSS_002');
    };

    var isUserSel = function (data, status, headers, config, statusText) {
        CX.log("successIsSelUser");
        CX.log(data);

        if (!data.isSel ) {
        	isNotSelUser(data, status, headers, config, statusText);
        } else {

            $rootScope.$broadcast("receiveResponse");
            if ( data.isSig ) {
                CX.log('identifcationFailure');
                CX.error = 'CU-CON-EC04-ERR_001';
                $location.path("/echec_identification");
                return;
                //$scope.error = CX.MSG['CU-INS-EC02-ERR_001'];
            } else {
                $scope.error = Wording.get('cpt.cpt_erreur.CU-INS-EC01-ERR_001');
            }
        }
    };

    var isUserSelDetail = function (data, status, headers, config, statusText) {
        CX.log("successIsSelUser");

        if (!data.isSel ) {
        	isNotSelUserDetail(data, status, headers, config, statusText);
        } else {
            $rootScope.$broadcast("receiveResponse");
            if ( data.isSig ) {
                CX.log('identifcationFailure');
                CX.error = 'CU-CON-EC04-ERR_001';
                $location.path("/echec_identification");
                return;
                //$scope.error = CX.MSG['CU-INS-EC02-ERR_001'];
            } else {
                $scope.error = Wording.get('cpt.cpt_erreur.CU-INS-EC01-ERR_001');
            }
        }
    };


    var isNotSelUser = function (data, status, headers, config, statusText) {
        CX.log("errorIsSelUser");
        CX.log("data code :" + data);
        if (data.code && data.code == 404 && !data.isSel ) {
            $scope.mailCompte = $scope.mail;
            var request = new CX.MODEL.createUserSel(successCreateUserSel, errorCreateuserSel, CX.Transformers.createUserSelFromInscription($scope));
            request.execute();
        } else {
            $rootScope.$broadcast("receiveResponse");
            CX.log("server error when execute isUserSel");
        }
    };

    var isNotSelUserDetail = function (data, status, headers, config, statusText) {
        CX.log("errorIsSelUserDetail");
        CX.log(data);
        $rootScope.$broadcast("receiveResponse");
        if (data.code && data.code == 404 && !data.isSel ) {
            CX.log("successCreateUserSelDetail");
            CX.searchUserSigModel.birthDate_year  = $scope.birthYear;
            CX.searchUserSigModel.birthDate_month = $scope.birthMonth;
            CX.searchUserSigModel.birthDate_day   = $scope.birthDay;
            CX.searchUserSigModel.referenceUnknown = $scope.referenceUnknown;
            CX.searchUserSigModel.reference = $scope.reference;
            $location.path('/donnees_complementaires');
           /*if ( !data.isSig ) {
                $scope.tmpReference = $scope.reference;
                $scope.reference = null;
                var request = new CX.MODEL.createUserSel(successCreateUserSelDetail, errorCreateuserSel, CX.Transformers.createUserSelFromInscription($scope));
                $scope.reference = $scope.tmpReference;
            } else {
                var request = new CX.MODEL.createUserSel(successCreateUserSelDetail, errorCreateuserSel, CX.Transformers.createUserSelFromInscription($scope));
            }
            request.execute();*/
        } else {
            CX.log("server error when execute isUserSel");
            Wording.get('cpt.cpt_erreur.CU-RAT-EC01-MSS_002');
        }

    };

    var sigFound = function (sigUser) {
        CX.log("sigFound");
        CX.log(sigUser);
        $rootScope.$broadcast("receiveResponse");
        //**********************
        // (lv)- Si un seul userSig trouvé
        // on continue le déroulé des étapes :
        if(CX.searchUserSigModel.userSigCollec.length === 1){

            var exclusionCase = { "Décédé" : true, "Exclu": true, "Doublon":true };
            if(exclusionCase[sigUser.client[0].libelleEtat]) {
                CX.error = 'CU-RAT-EC01-MSS_002';
                $location.path("/echec_identification");
                $scope.error = Wording.get('cpt.cpt_erreur.CU-RAT-EC01-MSS_002');
            } else {
                $scope.useCase = "continue";
                CX.log($scope.useCase);
                $scope.gotoStep();
            }

        }

        //**********************
        // (lv)- Si payeurs -
        // on continue sur la vue multiple
        // pour que l'utilisateur choisisse :
        else {
            $location.path('/selection_identite');
        }

    };

    var sigNotFound = function (data, status, headers, config, statusText) {
        CX.log("sigNotFound");
        $scope.useCase = null;
        //$scope.reference = null;
        var request = new CX.MODEL.isUserSel(isUserSelDetail, isNotSelUserDetail, CX.Transformers.isUserSelFromInscription($scope));
        request.execute();
    };

    var businessValid = function () {
        var res = true;
        res = res && $scope.captchaResponse;
        if (!res) {
            $scope.error = Wording.get('cpt.cpt_erreur.IHM-TRANS-ERR_001');
        }
        return res;
    };

    $scope.gotoStep = function (stepName, options, event) {
        CX.log("GOTTOSTEP");
        //$scope.sendTagForm(event);

        $scope.formSubmitted = true;
        CX.log($scope.useCase);

        $scope.setUseCase();
        CX.log($scope.useCase);
        var businessValidProof = businessValid();
        var dateAndReferenceAreValidProof = dateAndReferenceAreValid();

        if ($scope.createCustomerSpaceForm.$valid && businessValidProof && dateAndReferenceAreValidProof && $scope.password == $scope.passwordConf) {

            // enregistre le pwd + email dans le model
            //  pour le choix multiple (cas payeur)
            CX.searchUserSigModel.password  = $scope.password;
            CX.searchUserSigModel.email     = $scope.mail;
            CX.emailCompte = $scope.mail;

            $scope.error = "";
            //CX.MODEL.saveForm("Formulaire", $scope, $cookieStore);
            /*var request = new CX.MODEL.isUserSel(isUserSel, isNotSelUser, CX.Transformers.isUserSelFromInscription($scope));
            request.execute();*/
            $rootScope.$broadcast("sendRequest");
            switch ($scope.useCase) {

                case "searchComplement":
                case "searchByReferenceAndBirthday":
                    var request = new CX.MODEL.searchUserSig(sigFound, sigNotFound, CX.Transformers.searchUserSigFromInscription($scope));
                    request.execute();
                    break;

                // Recherche sans référence SIG :
                // si l'utilisateur a rentré un email user Sel déjà existant -
                /*    var request = new CX.MODEL.isUserSel(isUserSelDetail, isNotSelUserDetail, CX.Transformers.isUserSelFromInscription($scope));
                    request.execute();*/
                default:
                    var request = new CX.MODEL.isUserSel(isUserSel, isNotSelUser, CX.Transformers.isUserSelFromInscription($scope));
                    request.execute();
            }


        }

    };



    $scope.sendTagForm = function(event, element)
    {
        if (!element && event) {
            element = $(event.currentTarget);
        }

        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }

        if (!element) {
            return;
        }


        //send event
        $scope.$emit("tagFormEvent", {
            "form": {
                "unknownSigReference": $scope.referenceUnknown ? 1 : 0
            },
            "callback": function() {
                element.click();
            }
        });
    };

    /**
     * get Date error
     * @use $scope.birthDay, $scope.birthMonth, $scope.birthYear
     *
     * @return errorMessage or false;
     */
    $scope.getDateError = function ()
    {
        if (!isDateValid.isOlder(4, $scope.birthYear, $scope.birthMonth, $scope.birthDay)) {
            return  Wording.get('cpt.cpt_erreur.CU-DET-EC01-ERR_001'); // "L'abonnement est accessible à l'âge de 4 ans minimum"; // SNA-RAT-EC02-ERR_001 SNA-RAT-EC02-ERR_006
        }

        if (!isDateValid.format($scope.birthYear, $scope.birthMonth, $scope.birthDay)) {

            return  Wording.get('cpt.cpt_erreur.CU-DET-EC01-ERR_002'); //"Erreur dans la saisie de la date de naissance. Merci de la saisir à nouveau."; //  SNA-RAT-EC02-ERR_002 SNA-RAT-EC02-ERR_007
        }

        return false;
    }

    var dateAndReferenceAreValid = function () {

        //controle de date si l'user a une carte ou s il en a financé une
        if ($scope.hasCard == 1 &&
            $scope.birthDay != '' &&
            $scope.birthMonth != '' &&
            $scope.birthYear != '') {

            return !!!$scope.getDateError();
        }

        // client reference is only mandatory when reference is known:
        $scope.errorReference = ($scope.referenceUnknown != null && $scope.referenceUnknown != true && $scope.reference == null);

        if ($scope.referenceUnknown == true || $scope.hasCard == 0) {
            $scope.reference = null;
        }

        if ($scope.hasCard == 1 && (typeof $scope.referenceUnknown == 'undefined' || $scope.referenceUnknown == false)) {
            if (!isDateValid.format($scope.birthYear, $scope.birthMonth, $scope.birthDay)) {
                $scope.error = Wording.get('cpt.cpt_erreur.CU-DET-EC01-ERR_002'); //"Erreur dans la saisie de la date de naissance. Merci de la saisir à nouveau."; //  SNA-RAT-EC02-ERR_002 SNA-RAT-EC02-ERR_007
                CX.log($scope.error);
                return false;
            }

            if (!isDateValid.isOlder(4, $scope.birthYear, $scope.birthMonth, $scope.birthDay)) {
                $scope.error = Wording.get('cpt.cpt_erreur.CU-DET-EC01-ERR_001'); // "L'abonnement est accessible à l'âge de 4 ans minimum"; // SNA-RAT-EC02-ERR_001 SNA-RAT-EC02-ERR_006
                CX.log($scope.error);
                return false;
            }

/*            // date is mandatory when the user already has an account, and he knows his client reference number
            if (($scope.birthDay == '' && $scope.birthMonth == '' && $scope.birthYear == '')
                || ( typeof $scope.birthDay == 'undefined' && typeof $scope.birthMonth == 'undefined' && typeof $scope.birthYear == 'undefined')) {
                $scope.error = CX.MSG["IHM-TRANS-ERR_001"];
                CX.log($scope.error);
                return false;
            }*/
            // client reference is mandatory
            if ($scope.reference == null || $scope.reference == "") {
                $scope.error = "Le numéro client n'est pas renseigné";
                CX.log($scope.error);
                return false;
            }
        }

        return true;
    }
};
