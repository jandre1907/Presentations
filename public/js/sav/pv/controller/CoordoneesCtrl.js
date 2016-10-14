(function(){
    "use strict";

    angular.module("SAV").controller("CoordonneesCtrl",[
        "SigClientModel", "SigSavForfaitModel", "$http", "$scope", "$rootScope", "initData", "$log", '$location',
        function(SigClientModel, SigSavForfaitModel, $http, $scope, $rootScope, initData, $log, $location) {
            var vm = this;

            var guessCase = function() {
                vm.useCase = "default";
                if(!initData.contrat || !initData.contrat[0]) {

                    return "ERROR_NO_CONTRACT";
                }

                if (initData.contrat[0].nameProduit == "Navigo Annuel") {

                    return  "NA";
                }

                if (initData.contrat[0].TP) {

                    return "IR_WITH_THIRD_PAYER_CHOICE1";
                }
                             
                if (!initData.contrat[0].contratCadre) {

                    return  "IR_WITHOUT_THIRD_PAYER";
                }

                if (initData.contrat[0].contratCadre && initData.contrat[0].contratCadre.codeChoixGestion == 1) {

                    return "IR_WITH_THIRD_PAYER_CHOICE1";
                }

                if (initData.contrat[0].contratCadre && initData.contrat[0].contratCadre.codeChoixGestion != 1) {

                    return "IR_WITH_THIRD_PAYER_CHOICE234";
                }
            }

            var getCase = function() {
                vm.useCase = guessCase();
                $rootScope.pv_useCase = vm.useCase;
            }

            var resetCtrl = function() {
                vm.userSig = initData.userSig[0];
                getCase();
                $log.log(initData.modifyUrl);
            }

            var getNextStep = function() {
                for(var step in $rootScope.progressBar) {

                    if ($rootScope.progressBar[step].index == 3) {

                        return step;
                    }
                }
            }

            resetCtrl();

            this.modifyUrl = function() {
                //location.href='{{ path('sel_edit_user', {'contract': contract, 'codeProduit': codeProduit , 'returnUrl': 'sel_contrat_bonplan'});
                var url = initData.modifyUrl.split('?')[0] + '/' + vm.userSig.reference + '?' + initData.modifyUrl.split('?')[1];
                window.location = url + "&landingPage=perte_vol_verification_coordonnees";
            }

            this.stepSubmit = function() {
                $location.path(getNextStep());
                //onclick="location.href='{{ path('sel_contrat_bonplan_confirm',{'contract': contract, 'codeProduit': codeProduit , 'returnUrl' : returnUrl})  }}';"
            };
        }
    ])
})();
