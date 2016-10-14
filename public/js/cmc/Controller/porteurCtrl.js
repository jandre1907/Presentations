CMC.Controllers.prototype.PorteurCtrl = function($scope, $io, $location, $q, $filter, $log, Normalization, Wording) {

    $scope.cities = [];
    var second = false;

    $scope.$on('$viewContentLoaded', function (event) {
        CMC.log("porteur template loaded");

        $scope = CMC.fillBirthDate($scope);
        $scope.disableSubmit = true;
        watchError();
        initCtrl();
    });

    // FLAG : affiche msg+image croix d'erreur - date -
    $scope.isDateValide = true;

    // FLAG : Par défaut, les champs nom et prénom sont obligatoire :
    $scope.isFirstLastNameMandatory = true;

    // Ecoute les entrées des champs de la dates pour validation :
    var watchError = function () {

        // Champ des emails :
        $scope.$watchGroup(
            [
                'step_form.emailtwo.$viewValue',
                'step_form.email.$viewValue'
            ],
            emailAreEqual
        );


        $scope.$watchGroup(
            [
                'userSig.birthDate.day',
                'userSig.birthDate.month',
                'userSig.birthDate.year'
            ],
            function () {
                $scope.dateOk = true;
                if (!$scope.step_form.birthday.$viewValue || !$scope.step_form.birthmonth.$viewValue || !$scope.step_form.birthyear.$viewValue) {
                    return;
                }

                var checkDate = CMC.dateValid($scope.userSig.birthDate.day, $scope.userSig.birthDate.month, $scope.userSig.birthDate.year);
                if (checkDate.ndDayPerMonthIsValid == "false" ||
                    checkDate.ageIsValid == "false" ||
                    checkDate.typeIsValid == "false" ||
                    checkDate.fevrier == "false") {
                    $scope.dateOk = false;
                }

                if (checkDate.toYoung == "true") {
                    $scope.error = $scope.errorMessages["SNA-CO-EC01-ERR_006"];
                    $scope.dateOk = false;
                } else if ($scope.error == $scope.errorMessages["SNA-CO-EC01-ERR_006"]) {
                    $scope.error = "";
                }

                $scope.step_form.birthday.$setValidity("date", $scope.dateOk);
                $scope.step_form.birthmonth.$setValidity("date", $scope.dateOk);
                $scope.step_form.birthyear.$setValidity("date", $scope.dateOk);

                if (!$scope.step_form.birthday.$error.date && !$scope.step_form.birthmonth.$error.date && !$scope.step_form.birthyear.$error.date) {
                    $scope.isDateValide = true;
                }
                else {
                    $scope.isDateValide = false;
                }
            }
        );
    };

    var timer;
    var emailAreEqual = function () {

        window.clearTimeout(timer);
        timer = window.setTimeout(function () {
            $scope.emailOk = true;
            if ($scope.userSel.emailTwin) {
                if ($scope.userSel.email) {
                    $scope.emailOk = $scope.userSel.email.toUpperCase() == $scope.userSel.emailTwin.toUpperCase();
                } else {
                    $scope.emailOk = false;
                }
            }

            $scope.step_form.email.$setValidity("emailEqual", $scope.emailOk);
            $scope.step_form.emailtwo.$setValidity("emailEqual", $scope.emailOk);
            $scope.$apply()
        }, 700);
    };

    $scope.$on('$locationChangeStart', function (event) {
        CMC.MODEL.saveStep($scope);
    });

    var initCtrl = function () {
        $scope.errorMessages = Wording.getCategorie("cdc").cdc_erreur;
        $scope = CMC.MODEL.loadStep($scope);

        // FLAG - Nomrmalisation Adresse :
        $scope.secondNormalize = false;

        // FLAG : l'utilisateur revient sur la page porteur :
        $scope.onModifierPorteur = false;

        enableEmail();
        showPassword();

        if ($scope.userSig.city && typeof $scope.userSig.city != "undefined" && $scope.userSig.city.length > 0) {
            $scope.cities = [{"label": $scope.userSig.city}];
            $scope.userSig.city = $scope.cities[0];
        }

        $scope.$watchGroup(
            [
                'rawMobile',
                'rawFixe'
            ],
            function () {
                $scope.rawMobile = $filter('phoneFilter')($scope.rawMobile);
                $scope.userSig.mobile = $filter('phoneUnfilter')($scope.rawMobile);

                $scope.rawFixe = $filter('phoneFilter')($scope.rawFixe);
                $scope.userSig.phone = $filter('phoneUnfilter')($scope.rawFixe);

                $scope.step_form.mobile.$setValidity('phonePrefix', $scope.userSig.mobile.length == 10 && ($scope.userSig.mobile.substr(0, 2) == '07' || $scope.userSig.mobile.substr(0, 2) == '06'));
                $scope.step_form.telephoneFixe.$setValidity('phonePrefix', ($scope.userSig.phone && $scope.userSig.phone.length == 10 && $scope.userSig.phone.substr(0, 2) != '07' && $scope.userSig.phone.substr(0, 2) != '06' && $scope.userSig.phone.substr(0, 1) == '0'));
                $scope.step_form.telephoneFixe.$setValidity('phonePrefix', $scope.step_form.telephoneFixe.$valid || $scope.userSig.phone == "" || $scope.userSig.phone == null);
            }
        );

        $scope.$watchGroup(
            [
                'userSig.mobile',
                'userSig.phone'
            ],
            function () {
                $scope.rawMobile = $filter('phoneFilter')($scope.userSig.mobile);
                $scope.rawFixe = $filter('phoneFilter')($scope.userSig.phone);
            }
        );

        nextCase("init");
    };


    var getCase = function () {
        if ($scope.orderCase) {
            return $scope.orderCase;
        }

        if ($scope.formSubmitted) {
            return "NonCON_NonSIG_NonSEL2";
        }
        var guessCase = "default";

        return guessCase;
    };

    var defaultCase = function () {
        enableSubmit();
    };

    var gotoStep = function (nextStep) {
        CMC.MODEL.saveStep($scope);
        $location.path(nextStep);
    };

    $scope.submitForm = function () {
        $scope.error = "";
        $scope.formSubmitted = true;

        if ($scope.step_form.$invalid) {
            window.scroll(0, 0);
            return;
        }

        nextCase("checkUserCase");
    };

    $scope.getCities = function (inputValue) {

        if (inputValue === undefined || inputValue < 5) {
            return;
        }
        reqCities();
    };

    var error = function (message) {
        if (typeof message != 'undefined') {
            $scope.error = message;
        } else {
            $scope.error = $scope.errorMessages['SNA-CO-EC01-ERR_008'];
        }
        // CMC.log(msg);
    };

    $scope.setBirthDate = function () {
        $scope.userSig.dateNaissance = $scope.userSig.birthDate.year + '-' + $scope.userSig.birthDate.month + '-' + $scope.userSig.birthDate.day;// + 'T00:00:01';
        // CMC.MODEL.log($scope.userSig.dateNaissance);
    };

    var reqCities = function () {
        var expose = $q.defer();
        var receive = $io.execute("getCities", $scope.userSig.postalCode.substr(0, 5), CMC.Transformers.getCities, CMC.Parsers.getCities);
        receive.then(
            function success(cities) {
                $scope.cities = cities;
                $scope.userSig.city = $scope.cities[0];
                expose.resolve(cities);
            },
            function error(msg) {
                CMC.log(msg);
                expose.reject(msg);
            }
        );

        return expose.promise;
    };

    var getUserCase = function () {
        var expose = $q.defer();
        if (true || $scope.userSel.email || $scope.userInfo.reference) {
            $scope.codeProduit = 3;
            var receive = $io.execute("getUserCase", $scope, CMC.Transformers.getUserCaseFromPorteur, CMC.Parsers.getUserCaseFromPorteur);
            receive.then(
                function success(data) {
                    $scope.userContext = data.raw.atomCase;
                    if (data.reference) {
                        $scope.userSel.reference = data.reference;
                        $scope.userSig.reference = data.reference;
                    }
                    if (data.email) {
                        $scope.userSel.email = data.email;
                    }
                    if (data.NPAI) {
                        nextCase("NPAI");
                    }

                    $log.log("// reference  : " + $scope.userSel.reference);
                    $log.log("// email      : " + $scope.userSel.email);
                    $log.log("// hasCard    : " + $scope.userInfo.hasCard);
                    $log.log("// newUser    : " + $scope.userInfo.isNew);

                    expose.resolve(data.useCase + (second ? "2" : ""));
                },
                function error(msg) {
                    CMC.log(msg);
                    expose.reject(msg);
                }
            );
        } else {
            expose.resolve('');
        }

        return expose.promise;
    };

    var fillFormWithSIG = function () {
        var expose = $q.defer();
        var receive = $io.execute("getUserSigByReference", $scope, CMC.Transformers.getUserSigByReferenceFromPorteur, CMC.Parsers.getUserSigByReferenceFromPorteur);
        receive.then(
            function (data) {

                // memorise userSig.reference & valeur optin "conditions generales" & ....
                var userReference = $scope.userSig.reference;
                var userOptinConditionGenerale = $scope.userSig.acceptContract;
                var country = $scope.userSig.country;
                if ($scope.userSig.photoValid) {
                    var userPhotoValid = $scope.userSig.photoValid;
                }

                if ($scope.userSig.photoOriginal) {
                    var userPhotoOriginal = $scope.userSig.photoOriginal;
                }

                $scope.userSig = CMC.overwriteObject(data.userSig, $scope.userSig);
                $scope.userSel.email = data.email;

                // Re-Affecter UserSig.reference & valeur optin
                $scope.userSig.reference = userReference;
                $scope.userSig.acceptContract = userOptinConditionGenerale;
                $scope.userSig.country = country;
                $scope.userSig.photoValid = userPhotoValid;
                $scope.userSig.photoOriginal = userPhotoOriginal;

                $scope.cities.push(data.city || "");
                $scope.userSig.city = $scope.cities[0];

                if (data.city.telephone) {
                    $scope.userSig.phone = data.city.telephone;
                }
                ;

                expose.resolve(data);
            },
            function (msg) {
                expose.reject(msg);
            }
        );

        return expose.promise;
    };

    //-----------------------------
    //  CREATE USER SIG
    //-----------------------------
    var createUserSig = function() {
        var expose = $q.defer();
        var receive = $io.execute("searchUserAndSave", $scope, CMC.Transformers.createUserSig, CMC.Parsers.createUserSig);
        receive.then(
            function(response) {
                $scope.userInfo.isNew = true;
                $scope.userSel.reference = response.referenceClient;
                $scope.userSig.reference = response.referenceClient;
                expose.resolve();
            },
            function(msg) {
                $log.log("Error :");
                $log.log(msg);
                expose.reject(msg);
            }
        );

        return expose.promise;
    };

    //-----------------------------
    //  UPDATE USER SIG
    //-----------------------------
    var updateUserSig = function () {
        var expose = $q.defer();
        var receive = $io.execute("searchUserAndSave", $scope, CMC.Transformers.updateUserSig, CMC.Parsers.updateUserSig);

        receive.then(
            function (response) {
                $scope.userSel.reference = response.client.reference;
                $scope.userSig.reference = response.client.reference;
                expose.resolve();
            },
            function (msg) {
                expose.reject(msg);
            }
        );

        return expose.promise;
    };

    //-----------------------------
    //  CREATE USER SEL
    //-----------------------------
    var createFullUserSel = function (reference) {
        var expose = $q.defer();
        var receive = $io.execute("createFullUserSel", $scope, CMC.Transformers.createFullUserSel);
        receive.then(
            function (response) {
                CMC.log(response);
                expose.resolve({
                    "reference": reference,
                    "data": response
                });
            },
            function (response) {
                expose.reject(response);
            }
        );

        return expose.promise;
    };

    //-----------------------------
    //  UPDATE FULL USER SEL
    //-----------------------------
    var updateFullUserSel = function (reference) {
        var expose = $q.defer();
        var receive = $io.execute("updateFullUserSel", $scope, CMC.Transformers.updateUserSelFull);
        receive.then(
            function (data) {
                expose.resolve();
            },
            function (msg) {
                expose.reject(msg);
            }
        );

        return expose.promise;
    };

    // disable first & last name ....
    var disableFirstLastName = function () {
        $scope.userInfo.IsSIG = true;
        $scope.isFirstLastNameMandatory = false;
    };

    var disableEmail = function () {
        $scope.disableEmail = true;
        $scope.emailRequired = false;
    };

    var enableEmail = function () {
        $scope.disableEmail = false;
        $scope.emailRequired = true;
    };

    var emptyPassword = function () {
        $scope.userSel.password = "";
        $scope.userSel.passwordTwin = "";
    };

    var hidePassword = function () {
        $scope.hidePassword = true;
        $scope.passwordRequired = false;
    };

    var showPassword = function () {
        $scope.hidePassword = false;
        $scope.passwordRequired = true;
    };

    var showLoginMessage = function () {
        $scope.error = $scope.errorMessages["CU-INS-EC01-ERR_001"];
    };

    var showNPAIMessage = function () {
        $scope.error = $scope.errorMessages["CU-INS-EC03-MSS_001"];
    };

    var showNAActifMessage = function () {
        $scope.error = $scope.errorMessages["CMC-CO-EC01-MSS_001"];
    };

    var showIRActifMessage = function () {
        $scope.error = $scope.errorMessages["CMC-CO-EC01-MSS_001"];
    };

    var showNAOrderWaitingMessage = function () {
        $scope.error = $scope.errorMessages["CMC-CO-EC01-MSS_001"];
    };

    var showNAInlineMessage = function () {
        $scope.error = $scope.errorMessages["SNA-CO-EC01-ERR_009"];
    };

    var showNAPaperMessage = function () {
        $scope.error = $scope.errorMessages["SNA-CO-EC01-ERR_010"];
    };

    var showDEDIMessage = function () {
        $scope.error = $scope.errorMessages["SNA-CO-EC01-ERR_008"];
    };

    var showHasAlreadyACardMessage = function() {
        $scope.error = $scope.errorMessages["CMC-CO-EC01-ERR_001"];
    }

    var disableSubmit = function () {
        $scope.disableSubmit = true;
    };

    var enableSubmit = function () {
        $scope.disableSubmit = false;
    };

    var gotoNextStep = function () {
        gotoStep("/Photo");
    };

    var nextCase = function (orderCase) {
        $scope.orderCase = $scope.orderCase || orderCase || false;
        var useCase = getCase();
        $scope.orderCase = false;

        switch (useCase) {

            case "init":
                getUserCase()
                    .then(
                    function (ncase) {
                        nextCase(ncase);
                    },
                    error
                );
                break;

            case "NA_actif":
                showNAActifMessage();
                break;

            case "IR_actif":
                showIRActifMessage();
                break;

            case "NA_enCoursEnLigne":
                showNAOrderWaitingMessage();
                break;

            case "NA_enCoursPapier":
                showNAOrderWaitingMessage();
                break;

            case "NMS_actif":
            case "NMS_actif2":
                showHasAlreadyACardMessage();
                disableSubmit();
                break;
            /////////////////// NA_actif

            case "NA_actif2":
                nextCase("NA_actif");
                nextCase("2");
                break;

            case "NonCON_SIG_nonSEL_NA_actif":
                nextCase("NA_actif");
                nextCase("NonCON_SIG_nonSEL");
                break;

            case "NonCON_SIG_nonSEL_NA_actif2":
                nextCase("NA_actif");
                nextCase("NonCON_SIG_nonSEL2");
                break;

            case "CON_SIG_NA_actif": //atteinte parcours
                nextCase("NA_actif");
                nextCase("CON_SIG");
                break;

            case "CON_SIG_NA_actif2": //atteinte parcours
                nextCase("NA_actif");
                nextCase("CON_SIG2");
                break;

            /////////////////////////// IR_actif
            case "IR_actif2":
                nextCase("IR_actif");
                nextCase("2");
                break;
            case "NonCON_SIG_nonSEL_IR_actif":
                nextCase("IR_actif");
                nextCase("NonCON_SIG_nonSEL");
                break;
            case "NonCON_SIG_nonSEL_IR_actif2":
                nextCase("IR_actif");
                nextCase("NonCON_SIG_nonSEL2");
                break;
            case "CON_SIG_IR_actif":
                nextCase("IR_actif");
                nextCase("CON_SIG");
                break;
            case "CON_SIG_IR_actif2":
                nextCase("IR_actif");
                nextCase("CON_SIG2");
                break;

            ///////////////////////// NA_enCoursEnLigne
            case "NonCON_SIG_nonSEL_NA_enCoursEnLigne":
                nextCase("NA_enCoursEnLigne");
                nextCase("NonCON_SIG_nonSEL");
                break;
            case "CON_SIG_NA_enCoursEnLigne":
                nextCase("NA_enCoursEnLigne");
                nextCase("CON_SIG");
                break;
            case "NA_enCoursEnLigne2":
                nextCase("NA_enCoursEnLigne");
                nextCase("2");
                break;
            case "NonCON_SIG_nonSEL_NA_enCoursEnLigne2":
                nextCase("NA_enCoursEnLigne");
                nextCase("NonCON_SIG_nonSEL2");
                break;
            case "CON_SIG_NA_enCoursEnLigne2":
                nextCase("NA_enCoursEnLigne");
                nextCase("CON_SIG2");
                break;

            ///////////////// NA_enCoursPapier
            case "NA_enCoursPapier2":
                nextCase("NA_enCoursPapier");
                nextCase("2");
                break;
            case "CON_SIG_NA_enCoursPapier":
                nextCase("NA_enCoursPapier");
                nextCase("CON_SIG");
                break;
            case "CON_SIG_NA_enCoursPapier2":
                nextCase("NA_enCoursPapier");
                nextCase("CON_SIG2");
                break;
            case "NonCON_SIG_nonSEL_NA_enCoursPapier":
                nextCase("NA_enCoursPapier");
                nextCase("NonCON_SIG_nonSEL");
                break;
            case "NonCON_SIG_nonSEL_NA_enCoursPapier2":
                nextCase("NA_enCoursPapier");
                nextCase("NonCON_SIG_nonSEL2");
                break;

            //////////////////////////// NonConSEL

            case "NonCON_SIG_SEL_IR_actif":
            case "NonCON_SIG_SEL_NA_actif":
            case "NonCON_SIG_SEL_NA_enCoursEnLigne":
            case "NonCON_SIG_SEL_NA_enCoursPapier":
            case "NonCON_SIG_SEL_IR_actif2":
            case "NonCON_SIG_SEL_NA_actif2":
            case "NonCON_SIG_SEL_NA_enCoursEnLigne2":
            case "NonCON_SIG_SEL_NA_enCoursPapier2":
                CMC.MODEL.gotoPage(SEL.prefix_front + "login"/*+ #message*/);
                //todo feature show message in login page
            break;

            /////////////////////// user case

            case "NonCON_NonSIG_NonSEL":
                enableSubmit();
                break;
            case "NonCON_NonSIG_SEL":
                nextCase("login");
                break;
            case "NonCON_SIG_nonSEL":
                fillFormWithSIG();
                emptyPassword();
                disableFirstLastName();
                enableSubmit();
                break;

            case "NonCON_SIG_SEL":
                disableSubmit();
                fillFormWithSIG();
                hidePassword();
                disableEmail();
                showLoginMessage();
                break;

            case "CON_SIG_SEL":
            case "CON_SIG":
                fillFormWithSIG();
                hidePassword();
                disableEmail();
                enableSubmit();
                break;
            case "CON_nonSIG":
                hidePassword();
                disableEmail();
                enableSubmit();
                break;
            case "NPAI":
                showNPAIMessage();
                enableSubmit();
                break;
            case "FP_NA_actif":
                disableSubmit();
                showNAActifMessage();
                break;
            case "DEDI":
                showDEDIMessage();
                disableSubmit();
                break;

            case "2":
            case "NonCON_NonSIG_NonSEL2":
                createUserSig()
                .then(
                    function () {
                        createFullUserSel()
                            .then(gotoNextStep, error);

                    },
                    error
                );
                break;
            case "NonCON_NonSIG_SEL2":
                break;

            case "NonCON_SIG_nonSEL2":
                updateUserSig().then(
                    function () {
                        createFullUserSel().then(
                            function () {
                                gotoNextStep();
                            },
                            function () {
                                error();
                            }
                        )
                    },
                    // FAIL :
                    function () {
                        error();
                    }
                );
                break;
            case "NonCON_SIG_SEL2":
                disableSubmit();
                fillFormWithSIG();
                hidePassword();
                disableEmail();
                showLoginMessage();
                break;
            case "CON_SIG2":
                hidePassword();
                disableEmail();
                gotoNextStep();
                break;
            case "CON_nonSIG2":
                gotoNextStep();
                break;
            case "FP_NA_actif2":
                disableSubmit();
                showNAActifMessage();
                break;
            case "DEDI2":
                showDEDIMessage();
                disableSubmit();
                break;
            case "checkUserCase":
                second = true;
                doNormalization().then(
                    function () {
                        if (!$scope.userInfo.isNew) { //TODO remove condition  isNew is given to getUserCase
                            getUserCase()
                            .then(
                                nextCase,
                                error
                            )
                        } else {
                            nextCase("updateUser");
                        }
                    }
                );
                break;
            case "updateUser": //TODO control and remove cf case checkUserCase
                // FLAG : l'utilisateur revient sur la page porteur :
                $scope.onModifierPorteur = true;
                updateUserSig()
                .then(updateFullUserSel)
                .then(gotoNextStep)
                .catch(error);
                break;

            case "login":
                CMC.MODEL.gotoPage(SEL.prefix_front);
                break;
            case "photo":
                gotoStep("/Photo");
                break;

            case "identification":
                gotoStep("/Identification");
                break;

            case "createUserSel":
                createFullUserSel()
                    .then(
                    gotoNextStep,
                    error
                );
                break;
            case "updateUserSel":
                updateFullUserSel()
                    .then(
                    gotoNextStep,
                    error
                );
                break;
            default:
                defaultCase();
        }
    }

    function doNormalization() {
        var expose = $q.defer();

        var addressDataMapper = {
            line3: function(line3) {
                if (typeof line3 != 'undefined') {
                    $scope.userSig.ligne3 = line3;
                }
                return $scope.userSig.ligne3;
            },
            line2: function(line2) {
                if (typeof line2 != 'undefined') {
                    $scope.userSig.street2 = line2;
                }
                return $scope.userSig.street2;
            },
            line1: function(line1) {
                if (typeof line1 != 'undefined') {
                    $scope.userSig.street1 = line1;
                }
                return '';
            },
            zipCode: function(zipCode) {
                if (typeof zipCode != 'undefined') {
                    $scope.userSig.postalCode = zipCode;
                }
                return $scope.userSig.postalCode;
            },
            distributionOffice: function(distributionOffice) {
                if (typeof distributionOffice != 'undefined') {
                    $scope.userSig.city.bureauDistributeur = distributionOffice;
                }
                return $scope.userSig.city.bureauDistributeur;
            },
            cityInseeCode: function(cityInseeCode) {
                if (typeof cityInseeCode != 'undefined') {
                    $scope.userSig.city.codeInseeCommune = cityInseeCode;
                }
                return $scope.userSig.city.codeInseeCommune;
            },
            line4: function(line4) {
                if (typeof line4 != 'undefined') {
                    $scope.userSig.ligne4 = line4;
                }
                return $scope.userSig.ligne4;
            },
            country: function(country) {
                if (typeof country != 'undefined') {
                    $scope.userSig.country = country;
                }
                return $scope.userSig.country;
            },
            fullComplement: function(fullComplement) {
                if (typeof fullComplement != 'undefined') {
                    $scope.userSig.street2 = fullComplement ;
                }
                return $scope.userSig.street2;
            } // fullComplement is necessarily the last key
        };

        Normalization.normalizeAddress(
            $scope,
            function (normalizationResult) {
                expose.resolve(normalizationResult)
            },
            function (normalizationResult) {
                expose.reject({code: '400', message: 'Server as encountered an error'})
            },
            addressDataMapper
        );

        return expose.promise;
    }
};
