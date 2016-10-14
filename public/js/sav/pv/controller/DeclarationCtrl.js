(function(){
    "use strict";

    angular.module("SAV").controller("DeclarationCtrl",[
        "SigClientModel", "SigSavForfaitModel", "$http", "$scope", "$rootScope", "initData", "$log", '$location', "Wording",
        function(SigClientModel, SigSavForfaitModel, $http, $scope, $rootScope, initData, $log, $location, Wording) {
            var vm = this;

            var BUTTON_MSG_TITLE_OK = Wording.get('pv.pv_declaration.Bt_ok_title');
            var BUTTON_MSG_TITLE_RETURN = Wording.get('pv.pv_declaration.Bt_return_title');

            var BUTTON_MSG_OK = Wording.get('pv.pv_declaration.Bt_ok_msg');
            var BUTTON_MSG_RETURN = Wording.get('pv.pv_declaration.Bt_return_title');

            var BUTTON_LOCATION_OK = false;
            var BUTTON_LOCATION_RETURN = "espace_client";

            var BUTTON_PATH_OK = "/perte_vol_verification_coordonnees";
            var BUTTON_PATH_RETURN = false;

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
                nextCase(vm.useCase);
            }

            var init = function() {
                $scope.reference = initData.contrat[0].numeroPorteur;
                $scope.passNumber = initData.refPass;
                $rootScope.passNumber = initData.refPass;
                getCase();
            }

            var nextCase = function(useCase) {
                switch (useCase) {
                    case "NA":
                        $log.log("NA");
                        vm.meskey = "SAV-PV-DEC-EC01-MSS_001";
                        vm.meskey2 = "vide";
                        vm.meskey3 = "label_legendValidite_casNA_IR";
                        vm.buttonPath = BUTTON_PATH_OK;
                        vm.buttonLocation = BUTTON_LOCATION_OK;
                        vm.buttonMessage = BUTTON_MSG_OK;
                        vm.buttonMessageTitle = BUTTON_MSG_TITLE_OK;
                    break;

                    case "IR_WITHOUT_THIRD_PAYER":
                        $log.log("IR_WITHOUT_THIRD_PAYER");
                        vm.meskey = "SAV-PV-DEC-EC01-MSS_001";
                        vm.meskey2 = "SAV-PV-DEC-EC01-MSS_002";
                        vm.meskey3 = "label_legendValidite_casNA_IR_tiers_pa";
                        vm.buttonPath = BUTTON_PATH_OK;
                        vm.buttonLocation = BUTTON_LOCATION_OK;
                        vm.buttonMessage = BUTTON_MSG_OK;
                        vm.buttonMessageTitle = BUTTON_MSG_TITLE_OK;
                    break;

                    case "IR_WITH_THIRD_PAYER_CHOICE1":
                        $log.log("IR_WITH_THIRD_PAYER_CHOICE1");
                        vm.meskey = "SAV-PV-DEC-EC01-MSS_003";
                        vm.meskey2 = "SAV-PV-DEC-EC01-MSS_002";
                        vm.meskey3 = "label_legendValidite_casNA_IR_tiers_pa";
                        vm.buttonPath = BUTTON_PATH_OK;
                        vm.buttonLocation = BUTTON_LOCATION_OK;
                        vm.buttonMessage = BUTTON_MSG_OK;
                        vm.buttonMessageTitle = BUTTON_MSG_TITLE_OK;
                    break;

                    case "IR_WITH_THIRD_PAYER_CHOICE234":
                        $log.log("IR_WITH_THIRD_PAYER_CHOICE234");
                        vm.meskey = "SAV-PV-DEC-EC01-MSS_001";
                        vm.meskey2 = "SAV-PV-DEC-EC01-MSS_002";
                        vm.meskey3 = "label_legendValidite_casNA_IR";
                        vm.buttonPath = BUTTON_PATH_OK;
                        vm.buttonLocation = BUTTON_LOCATION_OK;
                        vm.buttonMessage = BUTTON_MSG_OK;
                        vm.buttonMessageTitle = BUTTON_MSG_TITLE_OK;
                    break;

                    default:
                        $log.log("DEFAULT");
                        vm.meskey = "vide";
                        vm.buttonPath = BUTTON_PATH_RETURN;
                        vm.buttonLocation = BUTTON_LOCATION_RETURN;
                        vm.buttonMessage = BUTTON_MSG_RETURN;
                        vm.buttonMessageTitle = BUTTON_MSG_TITLE_RETURN;
                    break;
                }
            }

            this.stepSubmit = function() {
                if(vm.buttonPath) {
                    $location.path(vm.buttonPath);
                }

                if(vm.buttonLocation) {
                    window.location.hash = "";
                    window.location = vm.buttonLocation;
                }
            };

            init();
        }
    ])
})();
