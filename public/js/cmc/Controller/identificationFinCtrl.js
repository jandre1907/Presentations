CMC.Controllers.prototype.IdentificationFinCtrl = function($scope, $location, Wording) {

    var vm = this;

    $scope.$on('$viewContentLoaded', function() {
        initCtrl();
    });

    var initCtrl = function() {
        $scope.errorMessages = Wording.getCategorie("cdc").cdc_erreur;
        $scope = CMC.MODEL.loadStep($scope);

        vm.userSigCollec = Rattachement.userSigCollection;
    };

    var error = function(msg){
        $log.log("error: " + msg);
        $scope.error = msg;
    }

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

    var getUserCase = function(userSig) { // a voir
        var expose = $q.defer();

        var receive = $io.execute(
            "getUserCase",
            {
                "userSig":  userSig,
                "userInfo": $scope.userInfo
            }
        )
        .then(function success(data) {
            switch (data.atomCase.GET_CASE) {
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
            }}
        )
        .catch(error);

        return expose.promise;
    };

    // Click bouton continuer :
    vm.onContinuer = function(selectedUserRef){
        getUserCase(vm.userSigCollec[selectedUserRef])
        .then(function(userSig) {
            vm.selectedUser = userSig;
            $scope.userInfo.isSig = true;
            $scope.userSel.reference = selectedUserRef;
            $scope.userSig.reference = selectedUserRef;
            $scope.userSig = userSig;

            // Sauve les données et repasse au formulaire porteur :
            $scope.userInfo.isSig = true;
            CMC.MODEL.saveStep($scope);
            $location.path("/Porteur");
        })
        .catch(error);

        return;
    }
};

