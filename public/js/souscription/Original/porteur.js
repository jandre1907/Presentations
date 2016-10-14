SEL.App.prototype.PorteurCtrl = function($scope, $io, $location, $sce, $route, $routeParams, $compile, Upload, $q, $cookieStore, $rootScope, $filter, Wording, Normalization) {
    var vm = this;
    vm.askedNormalization = true;
    $scope.$on('$viewContentLoaded', function(event) {
        SEL.APP.log("porteur template loaded");
        initCtrl();
    });

    $scope.$on('$locationChangeStart', function(event) {
       SEL.saveStep($scope);
    });

    var initCtrl = function() {
        SEL.APP.fall($location, {
           	"profil"  : "/Profil",
       	    "forfait" : "/Forfait"
        });
        second = false;
        $scope.secondNormalize = false;
        $scope = SEL.fillBirthDate($scope);
        $scope.disableSubmit = true;
        $scope.errorMessages = Wording.getCategorie('sna').sna_erreur;
        $scope = SEL.loadStep($scope);
        SEL.APP.log($scope.cart);
        enableEmail();
        showPassword();
        $scope.cities = [];
        $scope.userSig.city && $scope.cities.push($scope.userSig.city);
        watchError();
        SEL.HOLDER.forfait.hasBeenReached        = true;
        SEL.HOLDER.porteur.hasBeenReached        = true;
        SEL.HOLDER.photo.hasBeenReached          = false;
        SEL.HOLDER.paiement.hasBeenReached       = false;
        SEL.HOLDER.recapitulatif.hasBeenReached  = false;
        SEL.HOLDER.signature.hasBeenReached      = false;
        //SEL.HOLDER.confirmation.hasBeenReached   = false;

        nextCase('init');
    };

    var watchError = function() {
        $scope.$watchGroup(
            [
                'step_form.email.$viewValue',
                'step_form.emailtwo.$viewValue'
            ],
            emailAreEqual
        );

        $scope.$watchGroup(
            [
                'userSel.password',
                'userSel.passwordTwin'
            ],
            passwordAreEqual
        );

        $scope.$watchGroup(
            [
                'userSig.birthDate.day',
                'userSig.birthDate.month',
                'userSig.birthDate.year'
            ],
            dateIsValid
        );

        $scope.$watchGroup(
            [
                'rawMobile',
                'rawFixe'
            ],
            function() {
                $scope.rawMobile = $filter('phoneFilter')($scope.rawMobile);
                $scope.userSig.mobile = $filter('phoneUnfilter')($scope.rawMobile);

                $scope.rawFixe = $filter('phoneFilter')($scope.rawFixe);
                $scope.userSig.phone = $filter('phoneUnfilter')($scope.rawFixe);

                $scope.step_form.mobile.$setValidity('phonePrefix',$scope.userSig.mobile.length == 10 && ($scope.userSig.mobile.substr(0,2) == '07' || $scope.userSig.mobile.substr(0,2) == '06'));
                $scope.step_form.telephoneFixe.$setValidity('phonePrefix',($scope.userSig.phone.length == 10 && $scope.userSig.phone.substr(0,2) != '07' && $scope.userSig.phone.substr(0,2) != '06' && $scope.userSig.phone.substr(0,1) == '0'));
                $scope.step_form.telephoneFixe.$setValidity('phonePrefix',$scope.step_form.telephoneFixe.$valid || $scope.userSig.phone == "");

            }
        );

        $scope.$watchGroup(
            [
                'userSig.mobile',
                'userSig.phone'
            ],
            function() {
                $scope.rawMobile = $filter('phoneFilter')($scope.userSig.mobile);
                $scope.rawFixe   = $filter('phoneFilter')($scope.userSig.phone);
            }
        );
    }

    var timer;
    var emailAreEqual = function() {
        window.clearTimeout(timer);
        timer = window.setTimeout(function() {
            $scope.emailOk = true;
            if ($scope.userSel.emailTwin ) {
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
    }

    var passwordAreEqual = function() {
        $scope.passwordOk = $scope.userSel.password == $scope.userSel.passwordTwin
        $scope.step_form.password.$setValidity("password", $scope.passwordOk);
    }

    var dateIsValid = function() {
        $scope.dateOk = true;
        if (!$scope.step_form.birthday.$viewValue || !$scope.step_form.birthmonth.$viewValue || !$scope.step_form.birthyear.$viewValue) {
               return;
        }

        var checkDate = CMC.dateValid($scope.userSig.birthDate.day, $scope.userSig.birthDate.month, $scope.userSig.birthDate.year);
        if ( checkDate.ndDayPerMonthIsValid == "false" ||
             checkDate.ageIsValid           == "false" ||
             checkDate.typeIsValid          == "false" ||
             checkDate.fevrier              == "false") {

            $scope.dateOk = false;
        }

        if (checkDate.toYoung == "true") {
            $scope.error = $scope.errorMessages["SNA-CO-EC01-ERR_006"];
            $scope.dateOk = false;
        } else if($scope.error == $scope.errorMessages["SNA-CO-EC01-ERR_006"]) {
            $scope.error = "";
        }

        $scope.step_form.birthday.$setValidity("date", $scope.dateOk);
        $scope.step_form.birthmonth.$setValidity("date", $scope.dateOk);
        $scope.step_form.birthyear.$setValidity("date", $scope.dateOk);
    }

    var getCase = function() {
        if($scope.orderCase) {
            return $scope.orderCase;
        }

        if($scope.formSubmitted) {
            return "NonCON_NonSIG_NonSEL2";
        }
        var guessCase = "default";

        return guessCase;
    }

    var defaultCase = function() {
        SEL.APP.log("execute defaultCase");
        enableSubmit();
    }

    var gotoStep = function (nextStep) {
        SEL.saveStep($scope);
        //if(nextStep == "/Photo"){
        //    updateStep();
        //}
        $rootScope.$broadcast("receiveResponse");
        $location.path(nextStep);
    }

    vm.catchError = function(result) {
        if (typeof result.code == "undefined") {
            SEL.APP.log(result);
        }
        switch(result.code) {
            case 1://cancel normalization

            case 2:// normalization error

            case 100: //step submit error

            default:
                error();
                SEL.APP.log(result.msg);

        }
        return;
    };

    $scope.submitForm = function() {
        $scope.formSubmitted = true;
        if($scope.step_form.$invalid) {
            return;
        }
        $rootScope.$broadcast("sendRequest");
        doNormalization()
            .then(stepSubmit)
            .then(nextCase)
            .catch(vm.catchError);
    }

    $scope.getCities = function () {
        SEL.APP.log("getCities");
        if($scope.userSig.postalCode.length < 5) {
            return;
        }
        reqCities();
    }

    var error = function(msg){
        window.scroll(0,0);
        $scope.error = msg || $scope.errorMessages['SNA-CO-EC01-ERR_008'];
        SEL.APP.log(msg);
    }

    var reqCities = function() {
        var expose = $q.defer();
        var receive = $io.execute("getCities", $scope.userSig.postalCode.substr(0,5), SEL.Transformers.getCities, SEL.Parsers.getCities);
        receive.then(
            function success(cities) {
                $scope.cities = cities;
                $scope.userSig.city = $scope.cities[0];
                expose.resolve(cities);
            },
            function error(msg) {
                SEL.APP.log(msg);
                expose.reject(msg);
            }
        );

        return expose.promise;
    }

    var stepLoad = function() {
        var expose = $q.defer();
        var receive = $io.execute("stepLoad", {
            "params" : {
                "reference" : $scope.userSig.reference || $scope.userSel.reference || "",
                "email" :     $scope.userSig.email || $scope.userSel.email || "",
                "hasCard" :   $scope.userInfo.hasCard || "",
                "newUser" :   $scope.userInfo.isNew || "",
                "userSig" :   $scope.userSig || ""
            },
            "step" : "Porteur"
        });

        receive.then(
            function(data) {
                $scope.userInfo.isConnected = data.userContext.atomCase.CON;
                $scope.userInfo.hasCard     = data.userContext.atomCase.hasCard;
                $scope.userInfo.isUserSel   = data.userContext.atomCase.SEL;
                $scope.userInfo.isSig       = data.userContext.atomCase.SIG;

                var context = data.userContext.atomCase;
                if (data.userSig) {
                    $scope.userSig = data.userSig;
                    $scope.userSel.email = $scope.userSel.email || data.userSig.email;
                    $scope.userSel.emailTwin = $scope.userSel.email;
                    SEL.APP.log($scope.userSel);
                    $scope.userSel.password = "";
                    $scope.userSel.passwordTwin = "";
                    SEL.APP.log($scope.userSel);
                    setCity();
                }


                if (context.reference) {
                    $scope.userSel.reference = context.reference;
                    $scope.userSig.reference = context.reference;
                }

                if (context.email) {
                    $scope.userSel.email = $scope.userSel.email || context.email;
                    $scope.userSel.emailTwin = $scope.userSel.email;
                }


                if (context.SIG_STATE.NPAI) {
                    nextCase("NPAI");
                }

                if ( context.SIG_STATE.NA_TYPE.actif ) {
                    nextCase("FP_NA_actif");
                }


                SEL.APP.log(data);
                SEL.APP.log(context.GET_CASE + (second ? "2" : ""));
                expose.resolve(context.GET_CASE + (second ? "2" : ""));
            },
            function(msg) {
                SEL.APP.log(msg);
                expose.reject(msg);
            }
        );

        return expose.promise;
    }

    var doNormalization = function(data) {
        var expose = $q.defer();
        var dataMapper = {
            'line4': function line3(value) {
                if (typeof value != "undefined") {
                    $scope.line4 = value;
                }

                return "";
            },
            'line3': function line3(value) {
                if (typeof value != "undefined") {
                    $scope.userSig.street3 = value;
                }

                return $scope.userSig.street3;
            },
            'line2': function line3(value) {
                if (typeof value != "undefined") {
                    $scope.userSig.street2 = value;
                }

                return $scope.userSig.street2;
            },
            'line1': function line1(value) {
                if (typeof value != "undefined") {
                    $scope.userSig.street1 = value;
                }

                return "";
            },
            'zipCode': function zipCode(value) {
                if (typeof value != "undefined") {
                    $scope.userSig.postalCode = value;
                }

                return $scope.userSig.postalCode;
            },
            'distributionOffice': function distributionOffice(value) {
                if (typeof value != "undefined") {
                    $scope.userSig.city.bureauDistributeur = value;
                }

                return $scope.userSig.city.bureauDistributeur;
            },
            'cityInseeCode': function cityInseeCode(value) {
                if (typeof value != "undefined") {
                    $scope.userSig.city.codeInseeCommune = value;
                }

                return $scope.userSig.city.codeInseeCommune;
            },
            'country': function country(value) {
                if (typeof value != "undefined") {
                    $scope.userSig.country = value;
                }

                return $scope.userSig.country;
            },
            'fullComplement': function fullComplement(value) {
                if (typeof value != "undefined") {
                    $scope.userSig.street2 = value;
                }

                return $scope.userSig.street2;
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
                SEL.APP.log("erreur du service de normalisation");
                expose.reject({
                    "msg": "erreur du service de normalisation",
                    "code": 2
                });
            },
            dataMapper,
            null,
            function(response) {// normalization asked but canceled
                vm.askedNormalization = true;
                expose.reject(
                    {
                        "msg": "user has to modify address",
                        "code": 1
                    }
                );
            }
        );
        // } else {
        //     expose.resolve(data)
        // }
        return expose.promise;
    };

    var stepSubmit = function() {
        var expose = $q.defer();
        var receive = $io.execute(
            "stepSubmit",
            {
                "params": {
                    "cart":     $scope.cart,
                    "userSig":  $scope.userSig,
                    "payerSig": $scope.payerSig,
                    "userSel":  $scope.userSel,
                    "userInfo": $scope.userInfo
                    },
                "step": "Porteur"
            }
        )
        .then(function(data) {
            try {
                $scope.userSig.reference  = data.reference;
                $scope.userSig.customerId = data.customerId;
                $scope.userSig.contractId = data.contractId;
                $scope.userSig.lastname   = data.client.nom ;
                $scope.userSig.firstname  = data.client.prenom;
                $scope.userSig.isNotPayer = false;

                if (!data.stepUpdate) {
                    expose.reject();
                }
                expose.resolve(data.userContext.atomCase.GET_CASE + "2");
            } catch(e) {
                if (!data.stepUpdate) {
                    expose.reject();
                }
                expose.resolve(data.userContext.atomCase.GET_CASE + "2");
            }
        })
        .catch(function(result) {
            expose.reject(result);
            vm.catchError(result);
        });

        return expose.promise;
    }

    var setCartId = function(data) {
        $scope.cart.cartId = data.cartId;
    }

    var disableEmail = function() {
        $scope.disableEmail = true;
        $scope.emailRequired = false;
    };

    var enableEmail = function() {
        $scope.disableEmail = false;
        $scope.emailRequired = true;
    };

    var emptyPassword = function() {
        $scope.userSel.password     = "";
        $scope.userSel.passwordTwin = "";
    };

    var hidePassword = function() {
        $scope.hidePassword = true;
        $scope.passwordRequired = false;
    };

    var showPassword = function() {
        $scope.hidePassword = false;
        $scope.passwordRequired = true;
    };

    var hideAcceptContract = function() {
        $scope.hideAcceptContract = true;
    };

    var showAcceptContract = function() {
        $scope.hideAcceptContract = false;
    };

    var showLoginMessage = function() {
        window.scroll(0,0);
        $scope.error = $scope.errorMessages["CU-INS-EC01-ERR_001"];
    };

    var showNPAIMessage = function() {
        $scope.error = $scope.errorMessages["CU-INS-EC03-MSS_001"];
    };

    var showAddressNormalizationMessage = function() {
        $scope.error = "L'adresse saisie n'est pas normalisée, Veuillez confirmer ou changer votre adresse."; //$scope.errorMessages["CU-INS-EC03-MSS_001"];// a    changer
    };

    var showNAActifMessage = function() {
        $scope.error = $scope.errorMessages["SNA-CO-EC01-ERR_003"];
    };

    var showNAInlineMessage = function() {
        $scope.error = $scope.errorMessages["SNA-CO-EC01-ERR_009"];
    };

    var showNAPaperMessage = function() {
        $scope.error = $scope.errorMessages["SNA-CO-EC01-ERR_010"];
    };

    var showDEDIMessage = function() {
        $scope.error = $scope.errorMessages["SNA-CO-EC01-ERR_008"];
    };

    var disableSubmit = function() {
        window.scrollTo(0,100);
        $scope.disableSubmit = true;
    };

    var enableSubmit = function() {
        $scope.disableSubmit = false;
    };

    var disableLastname = function() {
        $scope.disableLastname = true;
    };

    var enableLastname = function() {
        $scope.disableLastname = false;
    };

    var disableFirstname = function() {
        $scope.disableFirstname = true;
    };

    var enableFirstname = function() {
        $scope.disableFirstname = false;
    };

    var gotoNextStep = function(){
        completeStep();
        gotoStep("/Photo");
    };

    var setCity = function() {
        $scope.cities = [];
        $scope.cities.push($scope.userSig.city);
        $scope.userSig.city = $scope.cities[0];
    }

    var completeStep = function(){
        SEL.MODEL.porteurStep = true;
        SEL.MODEL.Holder.porteur.valid = true;
    }

    var nextCase = function(orderCase) {
        SEL.APP.log(orderCase);
        $scope.orderCase = $scope.orderCase || orderCase || false;
        var useCase = getCase();
        $scope.orderCase = false;
        switch(useCase) {
            case "init":
                SEL.APP.log("init");
                stepLoad()
                .then(
                    function(ncase){
                        nextCase(ncase);
                    },
                    error
                )
                break;

                case "NonCON_NonSIG_NonSEL":
                    SEL.APP.log("NonCON_NonSIG_NonSEL");
                    enableSubmit();
                    //empty form
                    break;

                case "NonCON_NonSIG_SEL":
                    SEL.APP.log("NonCON_NonSIG_SEL");
                    nextCase("login");
                    break;

                case "NonCON_SIG_nonSEL":
                    SEL.APP.log("NonCON_SIG_nonSEL");
                    emptyPassword();
                    disableLastname();
                    disableFirstname();
                    enableSubmit();
                    break;

                case "NonCON_SIG_SEL":
                    SEL.APP.log("NonCON_SIG_SEL");
                    disableSubmit();
                    hidePassword();
                    disableEmail();
                    disableLastname();
                    disableFirstname();
                    showLoginMessage();
                    hideAcceptContract();
                    break;

                case "CON_SIG":
                    SEL.APP.log("CON_SIG");
                    hidePassword();
                    disableEmail();
                    enableSubmit();
                    disableLastname();
                    disableFirstname();
                    hideAcceptContract();

                    break;

                case "CON_nonSIG":
                    SEL.APP.log("CON_nonSIG");
                    hidePassword();
                    disableEmail();
                    enableSubmit();
                    hideAcceptContract();
                    break;

                case "NPAI":
                    SEL.APP.log("NPAI");
                    showNPAIMessage();
                    enableSubmit();
                    break;

                case "FP_NA_actif":
                    SEL.APP.log("FP_NA_actif");
                    disableSubmit();
                    showNAActifMessage();
                    break;

                case "FP_NA_enCoursPapier" :
                    SEL.APP.log("FP_NA_enCoursPapier");
                    disableSubmit();
                    showNAPaperMessage();
                    break;

                case "FP_NA_enCoursEnligne":
                    SEL.APP.log("FP_NA_enCoursEnligne");
                    showNAInlineMessage();
                    hideAcceptContract();
                    $scope.orderCase = "login";
                    enableSubmit();
                    break;

                case "DEDI":
                    SEL.APP.log("FP_NA_enCoursEnligne");
                    showDEDIMessage();
                    disableSubmit();
                    break;

                /***/
                case "2":
                case "NonCON_NonSIG_NonSEL2":
                    SEL.APP.log("NonCON_NonSIG_NonSEL2");
                    gotoNextStep();
                    break;

                case "NonCON_NonSIG_SEL2":
                    SEL.APP.log("ERROR: NonCON_NonSIG_SEL2");
                    break;

                case "NonCON_SIG_nonSEL2":
                    SEL.APP.log("NonCON_SIG_nonSEL2");
                    gotoNextStep();
                    break;

                case "NonCON_SIG_SEL2":
                    SEL.APP.log("ERROR: NonCON_SIG_SEL2");
                    disableSubmit();
                    hidePassword();
                    disableEmail();
                    showLoginMessage();
                    break;

                case "CON_SIG2":
                    SEL.APP.log("CON_SIG2");
                    hidePassword();
                    disableEmail();
                    gotoNextStep();
                    break;

                case "CON_nonSIG2":
                    SEL.APP.log("CON_SIG2");
                    gotoNextStep();
                    break;

                case "FP_NA_actif2":
                    SEL.APP.log("FP_NA_actif2");
                    disableSubmit();
                    showNAActifMessage();
                    break;

                case "FP_NA_enCoursPapier2" :
                    SEL.APP.log("FP_NA_enCoursPapier2");
                    disableSubmit();
                    showNAPaperMessage();
                    break;

                case "FP_NA_enCoursEnligne2":
                    SEL.APP.log("FP_NA_enCoursEnligne2");
                    showNAInlineMessage();
                    $scope.orderCase = "login";
                    enableSubmit();
                    break;

                case "DEDI2":
                    SEL.APP.log("FP_NA_enCoursEnligne");
                    showDEDIMessage();
                    disableSubmit();
                    break;

            // case "checkUserCase":
            //     SEL.APP.log("checkUserCase");
            //     second = true;
            //     if (!$scope.userInfo.isNew) {
            //         getUserCase()
            //         .then(
            //             function(ncase){
            //                 nextCase(ncase);
            //             },
            //             error
            //         )
            //     } else {
            //         nextCase("updateUser");
            //     }
            //     break;

            case "updateUser":
                updateSig()
                .then(updateUserSel, error)
                .then(gotoNextStep, error);
                break;

            case "login":
                SEL.MODEL.gotoPage("/connexion");
                break;

            case "photo":
                gotoStep("/Photo");

            case "identification":
                gotoStep("/Identification");
                break;
            //userCase
            case "userCase":
                break;

            default:
                defaultCase();
        }
    }

};