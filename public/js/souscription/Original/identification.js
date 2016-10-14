SEL.App.prototype.IdentificationCtrl = function ($scope, $io, $location, $http, $sce, $route,$routeParams, $compile, Upload, $q, $cookieStore, $rootScope, rattachementSearch, Wording) {

    var vm = this;
    $scope.disableSubmit = false;

    $scope.$on('$locationChangeStart', function(event) {
       $rootScope.$broadcast("sendRequest");
       SEL.saveStep($scope);
    });

    var resetCtrl = function() {
        $rootScope.$broadcast("receiveResponse");
        $scope.formSubmitted = false;
        $scope.errorMessages = Wording.getCategorie('sna').sna_erreur;
        $scope = SEL.loadStep($scope);

        watchError();
    }

    var watchError = function() {
        $scope.$watchGroup(
            [
                'userSig.birthDate.day',
                'userSig.birthDate.month',
                'userSig.birthDate.year'
            ],
            dateIsValid
        );
    }

    var error = function(msg){
        $log.log("error: " + msg);
        $scope.error = msg;
    }

    var guessCase = function(){
        if ($scope.userSig.unknowReference){

            return "COMPLEMENT";
        }

        return "SEARCH";
    }

    this.stepSubmit = function() {
        doCase("SUBMIT");
    };

    var showDEDIMessage = function () {
        $scope.error = $scope.errorMessages["SNA-CO-EC01-ERR_008"];
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

    var doCase = function(useCase) {
        switch (useCase) {
            case "SUBMIT":
                SEL.APP.log("SUBMIT");
                $scope.formSubmitted = true;
                vm.useCase = guessCase();
                doCase(vm.useCase)
            break;

            case "SEARCH":
                SEL.APP.log("SEARCH");
                searchUserSig();
            break;

            case "COMPLEMENT":
                SEL.APP.log("COMPLEMENT");
                gotoStep('/IdentificationSuite');
            break;

            case "FORFAIT":
                SEL.APP.log("FORFAIT");
                gotoStep('/Forfait');
            break;

            case "FP_NA_actif":
                SEL.APP.log("FP_NA_actif");
                showDEDIMessage();
                disableSubmit();
            break;

            case "MULTIPLE":

                SEL.APP.log("MULTIPLE");
                gotoStep('/IdentificationFin');
            break;

            case "DEDI":
                SEL.APP.log("DEDI");
                SEL.objects.userInfo.errorMessagesKey = "SNA-CO-ECO1-ERR_008";
                gotoStep('/echec_identification');
            break;

            default:
                SEL.APP.log("DEFAULT");
            break;
        }
    }

    var gotoStep = function(stepName) {
        $location.path(stepName);
    }

    var getUserCase = function(userSig) { // a voir
        var expose = $q.defer();

        var receive = $io.execute(
            "getUserCase",
            {
                "userSig":  userSig,
                "userInfo": $scope.userInfo
            }
        )
        .then(
            function success(data) {
                if (data.atomCase.GET_CASE == "FP_NA_actif") {
                    expose.reject("FP_NA_actif");
                    return;
                }
                expose.resolve(userSig);
            },
            function error(msg) {
                $scope.error = ("Un problème technique...");
            }
        );

        return expose.promise;
    }
    //TODO move into $io
    var searchUserSig = function() {

        var params = {
            clientNumber:    $scope.userSig.reference,//\D+ true        Numéro client://\D+ true        Numéro client,//SIG
            dateNaissance:   $scope.userSig.birthDate.year + '-' + $scope.userSig.birthDate.month + '-' + $scope.userSig.birthDate.day,//true        date de naissance du client
            prenom:          "",
            nom:             "",
            codePostal:      "",
            eMail:           "",
            telephoneMobile: "",
            verificationContract:1
        };

        rattachementSearch(
            params,
            function uniqSuccess(userSig) {
                getUserCase(userSig)
                .then(
                    function(userSig) {
                        $scope.userSig.reference = userSig.reference;
                        $scope.userSel.reference = userSig.reference;
                        doCase("FORFAIT");
                    },
                    function(caseName) {
                        doCase(caseName);
                    }
                )
            },
            function multipleSuccess(userSigCollection) {
                $scope.step.identification.userSigCollection = userSigCollection;
                doCase("MULTIPLE");
            },
            function searchFailure() {
                doCase("COMPLEMENT");
            },
            function dediFailure() {
                $scope.step.identification.errorMessageKey = "SNA-CO-ECO1-ERR_008";
                doCase("DEDI");
            }
        );
    };

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

    resetCtrl();
}