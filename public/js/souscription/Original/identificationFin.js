SEL.App.prototype.IdentificationFinCtrl = function ($scope, $io, $location, $http, $sce, $route,$routeParams, $compile, Upload, $q, $cookieStore, $rootScope, Wording) {
    var vm = this;
    $scope.disableSubmit = false;
    $scope.$on('$locationChangeStart', function(event) {
       SEL.saveStep($scope);
    });

    var resetCtrl = function() {
        $scope.formSubmitted = false;
        $scope.errorMessages = Wording.getCategorie('sna').sna_erreur;
        $scope = SEL.loadStep($scope);
        vm.userSigCollec = $scope.step.identification.userSigCollection;
        $rootScope.$broadcast("receiveResponse");
    }

    var error = function(msg){
        $log.log("error: " + msg);
        $scope.error = msg;
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

    this.onContinuer = function(indexSelectedUser) {
        if(typeof indexSelectedUser != "undefined"){
            getUserCase(vm.userSigCollec[indexSelectedUser])
                .then(
                    function(userSig) {
                        vm.selectedUser = userSig;
                        doCase("SUBMIT");
                    },
                    function(caseName) {
                        doCase(caseName);
                    }
                )

        }
    };

    var setUserSig = function(){
        $scope.userSel.reference = vm.selectedUser.reference;
    }

    var showDEDIMessage = function () {
        $scope.error = $scope.errorMessages["SNA-CO-EC01-ERR_008"];
    };

    var disableSubmit = function () {
        $scope.disableSubmit = true;
    };


    var doCase = function(useCase) {
        switch (useCase) {
            case "SUBMIT":
                SEL.APP.log("SUBMIT");
                setUserSig();
                doCase('FORFAIT');
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

            default:
                SEL.APP.log("DEFAULT");
            break;
        }
    }

    var gotoStep = function(stepName) {
        $location.path(stepName);
    }

    resetCtrl();
}
