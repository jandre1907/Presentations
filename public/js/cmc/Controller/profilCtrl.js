CMC.Controllers.prototype.ProfilCtrl = function($scope, $io, $location, $log, $q, Wording) {

    // origine :  CMC.Controllers.prototype.ProfilCtrl = function($scope, $io, $location, $sce, $route, $routeParams, $compile, Upload, $q, $cookieStore) {

    $scope.$on('$viewContentLoaded', function(event) {
        CMC.log("profil template loaded");
        initCtrl();
    });

    var initCtrl = function() {
        $scope.errorMessages = Wording.getCategorie("cdc").cdc_erreur;
        $scope = CMC.MODEL.loadStep($scope);

        // Active le bouton valider en cas de retour sur cette page
        if ($scope.userInfo.hasCard != null && $scope.userInfo.isUserSel != null) {
            // FLAG
            $scope.activeBoutonContinuer = true;
        }
        if(SEL.userIsConnected) {
            $scope.hideIsUserQuestion = true;
            $scope.userInfo.isUserSel = 1;
        }

        $scope.codeProduit = 3;
        getUserCase()
        .then(nextCase)
        .catch(error);
    };

    var getUserCase = function () {
        var expose = $q.defer();
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
                expose.resolve(data.useCase);
            },
            function error(msg) {
                CMC.log(msg);
                expose.reject(msg);
            }
        );

        return expose.promise;
    };

    var error = function (msg) {
        $scope.error = $scope.errorMessages['SNA-CO-EC01-ERR_008'];
        // CMC.log(msg);
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

    var nextCase = function(orderCase) {
        $scope.orderCase = $scope.orderCase || orderCase || false;
        var useCase = getCase();
        $scope.orderCase = false;

        switch(useCase) {


            case "NA_actif":
            case "CON_SIG_NA_actif": //atteinte parcours
            case "NonCON_SIG_nonSEL_NA_actif":
                showNAActifMessage();
                break;

            case "IR_actif":
            case "NonCON_SIG_nonSEL_IR_actif":
            case "CON_SIG_IR_actif":
                showIRActifMessage();
                break;

            case "NA_enCoursEnLigne":
            case "NonCON_SIG_nonSEL_NA_enCoursEnLigne":
            case "CON_SIG_NA_enCoursEnLigne":
            case "NA_enCoursPapier":
            case "CON_SIG_NA_enCoursPapier":
            case "NonCON_SIG_nonSEL_NA_enCoursPapier":
                showNAOrderWaitingMessage();
                break;

            case "NMS_actif":
                showHasAlreadyACardMessage();
                disableSubmit();
                break;

            case "NonCON_SIG_SEL_IR_actif":
            case "NonCON_SIG_SEL_NA_actif":
            case "NonCON_SIG_SEL_NA_enCoursEnLigne":
            case "NonCON_SIG_SEL_NA_enCoursPapier":
                CMC.MODEL.gotoPage(SEL.prefix_front + "login"/*+ #message*/);
                //todo feature show message in login page
            break;

            case "login":
                window.location.hash = "";
                window.location = "login?identification=" + $scope.userInfo.hasCard;
                break;
            case "identification":
                gotoStep("/Identification");
                break;
            case "porteur":
                gotoStep("/Porteur");
                break;
            default:
                defaultCase();
        }
    };

    var getCase = function() {
        if($scope.orderCase) {
            return $scope.orderCase;
        }

        var guessCase =
            ($scope.step_form.$submitted && $scope.userInfo.isUserSel == "1")  ? 'login'          :
            ($scope.step_form.$submitted && $scope.userInfo.isUserSel == "0" && $scope.userInfo.hasCard == "1")  ? 'identification' :
            ($scope.step_form.$submitted && $scope.userInfo.isUserSel == "0" && $scope.userInfo.hasCard == "0")  ? 'porteur'        :
            "default";
        if (SEL.userIsConnected && !$scope.userIsSig) {
            guessCase =

                ($scope.step_form.$submitted && $scope.userInfo.hasCard == "1")  ? 'identification' :
                ($scope.step_form.$submitted && $scope.userInfo.hasCard == "0")  ? 'porteur'        :
                "default";
        }

        if (SEL.userIsConnected && $scope.userIsSig) {
            guessCase = 'porteur';
        }

        return guessCase;
    };

    var defaultCase = function() {
        CMC.log("execute defaultCase");

        return;
    };

    var gotoStep = function (nextStep) {
        CMC.MODEL.saveStep($scope);
        $location.path(nextStep);
    };

    $scope.submitForm = function() {
        $scope.step_form.$setSubmitted();
        if($scope.step_form.$invalid) {
            return;
        }
        nextCase();
    };

    //----------------------------------------
    // Ecoute la valeur des boutons Radio isSig ou isSel
    // pour activer ou non le bouton "Continuer" :

    // son Flag
    $scope.activeBoutonContinuer = false;

    var isSigSelected = false || SEL.userIsSig;
    var isSelSelected = false || SEL.userIsConnected;

    $scope.onRadioChange = function(radioValue){

        if(radioValue != 0){
            if(radioValue === "sigSelected"){
                isSigSelected = true;
            }
            if(radioValue === "selSelected"){
                isSelSelected = true;
            }
            if(isSigSelected && isSelSelected){
                $scope.activeBoutonContinuer = true;
            }
        }
    };

    $scope.onRadioChange(0);
};