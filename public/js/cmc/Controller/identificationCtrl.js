CMC.Controllers.prototype.IdentificationCtrl = function($scope, $io, $location, $sce, $route, $routeParams, $compile, Upload, $q, rattachementSearch,$log, Wording) {
    $scope.cities = [];
    var second = false;

    $scope.$on('$viewContentLoaded', function(event) {
        CMC.log("porteur template loaded");
        $scope = CMC.fillBirthDate($scope);
        $scope.disableSubmit = true;
        initCtrl();
    });

    $scope.$on('$locationChangeStart', function(event) {
       CMC.MODEL.saveStep($scope);
    });

    var initCtrl = function() {
        $scope.errorMessages = Wording.getCategorie("cdc").cdc_erreur;
        $scope = CMC.MODEL.loadStep($scope);
        watchError();
        nextCase("init");
    };

    // FLAG : affiche msg+image croix d'erreur - date -
    $scope.isDateValide = true;

    // Ecoute les entrée des champs des dates pour validation :
    var watchError = function() {
        $scope.$watchGroup(
            [
                'userSig.birthDate.day',
                'userSig.birthDate.month',
                'userSig.birthDate.year'
            ],
            function(){
                $scope.dateOk = true;
                if (!$scope.step_form.birthday.$viewValue || !$scope.step_form.birthmonth.$viewValue || !$scope.step_form.birthyear.$viewValue) {
                    return;
                }

                var checkDate = CMC.dateValid($scope.userSig.birthDate.day, $scope.userSig.birthDate.month, $scope.userSig.birthDate.year);
                if ( checkDate.ndDayPerMonthIsValid == "false" ||
                    checkDate.ageIsValid            == "false" ||
                    checkDate.typeIsValid           == "false" ||
                    checkDate.fevrier               == "false") {

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

                if (!$scope.step_form.birthday.$error.date && !$scope.step_form.birthmonth.$error.date && !$scope.step_form.birthyear.$error.date){
                    $scope.isDateValide = true;
                }
                else{
                    $scope.isDateValide = false;
                }
            }
        );
    };



    var getCase = function() {
        if ($scope.orderCase) {

            return $scope.orderCase;
        }

        var guessCase = "default";

        return guessCase;
    };

    var defaultCase = function() {
        CMC.log("execute defaultCase");
        enableSubmit();
    };

    var gotoStep = function (nextStep) {
        CMC.MODEL.saveStep($scope);
        $location.path(nextStep);
    };

    $scope.submitForm = function()
    {
        $scope.formSubmitted = true;
        if($scope.step_form.$invalid) {
            return;
        }
        nextCase("checkForm");
    };

    var error = function(msg)
    {
        $scope.error = $scope.errorMessages['SNA-CO-EC01-ERR_008'];
        CMC.log(msg);
    };

    var uniqSuccess = function(userSig)
    {
        $scope.userInfo.isSig = true;

        // Mise a jour -  User Sel/Sig :
        $scope.userSel.email        = userSig.eMail;
        $scope.userSel.reference    = userSig.reference;
        $scope.userSig.reference    = userSig.reference;
        $scope.userSig = userSig;

        // -> nav to page Porteur.
        nextCase("porteur");
    }

    var searchUserSig = function()
    {
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
            function (userSig)
            {
                getUserCase(userSig)
                .then(uniqSuccess)
                .catch(error);
            },
            // Multiple réponse  -> page Multiple :
            function multipleSuccess(userSigCollection){
                $log.log(" Multiple  " );
                // Stocke la collection pour l'avoir dispopnible a la vue IdentificationFin (choix multiple).
                Rattachement.userSigCollection = userSigCollection;

                // -> nav to page IdentificationFin (pour le choix multiple pour rattachement).
                nextCase("choixMultiple");
            },
            // Pas de resultats -> page detail
            function searchFailure(){
                $log.log("Pas de resultats -> page detail");
                nextCase("identificationSuite");
            },
            function dediFailure(){
                $log.log(" dediFailure " );
                // msg : Nous ne sommes pas en mesure de donner suite  ....
                Rattachement.errorMessageKey = "SNA-PAI-EC01-ERR_008";
                nextCase("identificationFailure");
            }

        );
    };

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
                switch(data.atomCase.GET_CASE) {
                    case "NA_actif":
                    case "CON_SIG_NA_actif":
                    case "NonCON_SIG_SEL_NA_actif":
                    case "NonCON_SIG_nonSEL_NA_actif":
                        showNAActifMessage();
                        expose.resolve(userSig);
                        break;

                    case "IR_actif":
                    case "CON_SIG_IR_actif":
                    case "NonCON_SIG_SEL_IR_actif":
                    case "NonCON_SIG_nonSEL_IR_actif":
                        showIRActifMessage();
                        expose.resolve(userSig);
                        break;

                    case "NA_enCoursEnLigne":
                    case "CON_SIG_NA_enCoursEnLigne":
                    case "NonCON_SIG_SEL_NA_enCoursEnLigne":
                    case "NonCON_SIG_nonSEL_NA_enCoursEnLigne":

                    case "NA_enCoursPapier":
                    case "CON_SIG_NA_enCoursPapier":
                    case "NonCON_SIG_SEL_NA_enCoursPapier":
                    case "NonCON_SIG_nonSEL_NA_enCoursPapier":
                        showNAOrderWaitingMessage();
                        expose.resolve(userSig);
                        break;

                    case "NMS_actif":
                        showHasAlreadyACardMessage();
                        disableSubmit();
                        break;

                    default: expose.resolve(userSig);
                }
            },
            function error(msg) {
                $scope.error = ("Un problème technique...");
            }
        );

        return expose.promise;
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

    var gotoNextStep = function(){
        gotoStep("/Porteur");
    };

    var checkForm = function(){

        if ( $scope.userSig.reference == null && $scope.unknowReference === false) {
            return "badSigReference";
        }

        // Vérif de la date :
        var checkDate = CMC.dateValid($scope.userSig.birthDate.day, $scope.userSig.birthDate.month, $scope.userSig.birthDate.year);

        if ( checkDate.ndDayPerMonthIsValid == "false" ||
             checkDate.ageIsValid           == "false" ||
             checkDate.typeIsValid          == "false" ||
             checkDate.fevrier              == "false") {

            return  "dateInvalid";
        }

        if (checkDate.toYoung == "true") {

            return "tooYoung";
        }

        // Vérif de la reference :
        if ($scope.unknowReference == true) {

            return "identificationSuite";
        }

        return "searchUserSig"
    };

    var nextCase = function(orderCase) {
        $scope.orderCase = $scope.orderCase || orderCase || false;
        var useCase = getCase();
        $scope.orderCase = false;

        switch(useCase) {
            case "NA_actif":
            case "CON_SIG_NA_actif":
            case "NonCON_SIG_SEL_NA_actif":
            case "NonCON_SIG_nonSEL_NA_actif":
                showNAActifMessage();
                uniqSuccess()
                break;

            case "IR_actif":
            case "CON_SIG_IR_actif":
            case "NonCON_SIG_SEL_IR_actif":
            case "NonCON_SIG_nonSEL_IR_actif":
                showIRActifMessage();
                break;

            case "NA_enCoursEnLigne":
            case "CON_SIG_NA_enCoursEnLigne":
            case "NonCON_SIG_SEL_NA_enCoursEnLigne":
            case "NonCON_SIG_nonSEL_NA_enCoursEnLigne":
                showNAOrderWaitingMessage();
                break;

            case "NA_enCoursPapier":
            case "CON_SIG_NA_enCoursPapier":
            case "NonCON_SIG_SEL_NA_enCoursPapier":
            case "NonCON_SIG_nonSEL_NA_enCoursPapier":
                showNAOrderWaitingMessage();
                break;

            case "NMS_actif":
                showHasAlreadyACardMessage();
                disableSubmit();
                break;

            case "identificationSuite":
                gotoStep("/IdentificationSuite");
                break;
            case "identificationFin":
                gotoStep("/IdentificationFin");
                break;
            case "identificationHelp":
                gotoStep("/IdentificationHelp");
                break;
            case "identificationFailure":
                gotoStep("/echec_identification");
                break;
            case "photo":
                gotoStep("/Photo");
                break;
            case "checkForm" :
                nextCase(checkForm());
                break;
            case "dateInvalid" :
                $scope.error = $scope.errorMessages["SNA-RAT-EC02-ERR_002"];
                window.scroll(0,0);
                break;
            case "tooYoung" :
                $scope.error = $scope.errorMessages["SNA-CO-EC01-ERR_006"];
                window.scroll(0,0);
                break;
            case "badSigReference" :
                $scope.error = "Vous devez rentrer votre numéro client.";
                window.scroll(0,0);
                break;
            case "searchUserSig" :
                searchUserSig();
                break;

            case "porteur":
                gotoStep("/Porteur");
                break;

            case "choixMultiple":
                gotoStep("/IdentificationFin");
                break;

            default:
                defaultCase();
        }
    };

};