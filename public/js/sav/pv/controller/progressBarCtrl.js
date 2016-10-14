angular.module("SAV")
    .controller("ProgressBarCtrl", [
        '$rootScope', 'initData','$scope',
        function ($rootScope, initData, $scope) {
            var vm = this;
            var pbData = {
                "/perte_vol_declaration": {
                    label: "Déclaration",
                    class: "",
                    isReached: false,
                    link: "",
                    index: 1
                },
                "/perte_vol_verification_coordonnees": {
                    label: "Coordonnées",
                    class: "",
                    isReached: false,
                    link: "",
                    index: 2
                },
                "/perte_vol_moyen_de_paiement": {
                    label: "Paiement",
                    class: "",
                    isReached: false,
                    link: "",
                    index: 3
                },
                "/perte_vol_confirmation": {
                    label: "Confirmation",
                    class: "",
                    isReached: false,
                    link: "",
                    index: 4
                }
            };
            function getUseCase() {
                if (!initData.contrat || !initData.contrat[0]) {

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

                return 'UNKNOWN';
            }

            $scope.stepLength =  4;
            var usecase = getUseCase();
            if (usecase == "NA" || usecase == "IR_WITH_THIRD_PAYER_CHOICE1" || initData.contrat[0].NBMAX_IR) {
                pbData["/perte_vol_confirmation"].index = 3;
                delete pbData["/perte_vol_moyen_de_paiement"];
                $scope.stepLength =  3;
            }
            vm.pbData = pbData;
            $rootScope.progressBar = pbData;
            $scope.$watch(function(){return $rootScope.failPage;}, function(newValue) {
                $scope.failPage = newValue || false;
            })

        }
    ])
