(function(){
    "use strict";

    angular.module("SAV").controller("ConfirmationCtrl",[
        "SigClientModel", "SigSavForfaitModel", "$http", "$scope", "$rootScope", "initData", "$log", '$location', '$q', 'Wording',
        function(SigClientModel, SigSavForfaitModel, $http, $scope, $rootScope, initData, $log, $location, $q, Wording) {
            var vm = this;

            var BUTTON_MSG_TITLE_OK = Wording.get('pv.pv_confirmation.Bt_return_title');
            var BUTTON_MSG_OK = Wording.get('pv.pv_confirmation.Bt_return_title');

            var getInitialPaymentMethod = function() {
                if (initData.contrat[0].situationFinanciere.modePaiement == "Prélevement") {
                    return "SEPA";
                }

                return "CB";
            }

            var getInitialCase = function() {

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

                return "UNKNOWN";
            }


            var guessCase = function() {
                //pv_useCase set at Declaration step
                //pv_paymentMethod set at Payment step
                if ($rootScope.pv_useCase == "IR_WITH_THIRD_PAYER_CHOICE234" || $rootScope.pv_useCase == "IR_WITHOUT_THIRD_PAYER") {

                    return $rootScope.pv_useCase + "_" + $rootScope.pv_paymentMethod;
                }

                return $rootScope.pv_useCase;
            }

            var run = function() {
                vm.useCase = guessCase();
                doCase(vm.useCase);
            }

            var resetCtrl = function() {
                $scope.validatedDeclaration = false;
                $scope.failedDeclaration = false;
                $scope.passNumber = initData.refPass;
                if ($rootScope.pv_useCase != "PAYER_CB_WITHOUT_PAYMENT") {
                    $rootScope.pv_useCase = getInitialCase();
                    $rootScope.pv_paymentMethod = getInitialPaymentMethod();
                }
                vm.buttonMessageTitle = BUTTON_MSG_TITLE_OK;
                vm.buttonMessage = BUTTON_MSG_OK;
                run();
            }

            var error = function(msg){
            	$scope.failedDeclaration = true;
            	vm.meskey =  "SAV-P/V-CONF-MSS_001";//require reference
                $log.log("error: " + msg);
                $scope.error = msg;
            }

            var doCase = function(useCase) {


                switch (useCase) {
                    case "NA":
                    case "PAYER_CB_WITHOUT_PAYMENT":
                        $log.log("NA");
                        $scope.reference = getReference();
                        $scope.mail = getMail();
                        $scope.sendDate =  getSendDate();
                        vm.meskey =  "SAV-P/V-CONF-MSS_001";//require reference
                        vm.meskey2 = "SAV-P/V-CONF-MSS_004";//require mail
                        vm.meskey3 = "SAV-P/V-CONF-MSS_003";//require sendDate
                        vm.meskey4 = "SAV-P/V-CONF-MSS_006";
                        vm.meskey5 = "vide";
                        vm.meskey6 = "vide";
                        vm.meskey7 = "vide";
                        recordLossTheftSepa().then(
                                function () {
                                    $scope.validatedDeclaration = true;
                                })
                        .catch(error);
                    break;

                    case "IR_WITH_THIRD_PAYER_CHOICE234_CB":
                    case "IR_WITHOUT_THIRD_PAYER_CB":
                        $log.log("IR_WITH_THIRD_PAYER_CHOICE234_CB OR IR_WITHOUT_THIRD_PAYER_CB");
                        if (initData.contrat[0].NBMAX_IR) {
                            initData.typeError.error = 'V-LIM-EC02';
                            $location.path('/perte_vol_erreur');

                            return;
                        }
                        $scope.reference = getReference();
                        $scope.mail = getMail();
                        $scope.sendDate =  getSendDate();
                        $scope.buyAmount = getBuyAmount();
                        $scope.validatedDeclaration = true;
                        vm.meskey =  "SAV-P/V-CONF-MSS_008";//buyAmount
                        vm.meskey2 = "SAV-P/V-CONF-MSS_001";//require reference
                        vm.meskey3 = "SAV-P/V-CONF-MSS_003";//require mail
                        vm.meskey4 = "SAV-P/V-CONF-MSS_004";//require sendDate
                        vm.meskey5 = "SAV-P/V-CONF-MSS_005";
                        vm.meskey6 = "SAV-P/V-CONF-MSS_006";
                        vm.meskey7 = "vide";

                        //recordLossTheftCB(); has already been deed cf.Payment step
                    break;

                    case "IR_WITH_THIRD_PAYER_CHOICE1":
                        $log.log("IR_WITH_THIRD_PAYER_CHOICE1");
                        $scope.mail = getMail();
                        vm.meskey =  "SAV-P/V-CONF-MSS_007";
                        vm.meskey2 = "SAV-P/V-CONF-MSS_002";
                        vm.meskey3 = "SAV-P/V-CONF-MSS_003";//require mail
                        vm.meskey4 = "SAV-P/V-CONF-MSS_009";
                        vm.meskey5 = "vide";
                        vm.meskey6 = "vide";
                        vm.meskey7 = "vide";
                        recordLossTheftSepa().then(
                        		function () {
                        			$scope.validatedDeclaration = true;
                        		})
                        .catch(error);
                    break;

                    case "IR_WITH_THIRD_PAYER_CHOICE234_SEPA":
                    case "IR_WITHOUT_THIRD_PAYER_SEPA":
                        $log.log("IR_WITH_THIRD_PAYER_CHOICE234_SEPA OR IR_WITHOUT_THIRD_PAYER_SEPA");
                        $scope.reference = getReference();
                        $scope.mail = getMail();
                        $scope.sendDate =  getSendDate();
                        vm.meskey = "SAV-P/V-CONF-MSS_001";//require reference
                        vm.meskey2 = "SAV-P/V-CONF-MSS_004";//require mail
                        vm.meskey3 = "SAV-P/V-CONF-MSS_005";//require sendDate
                        vm.meskey4 = "SAV-P/V-CONF-MSS_003";
                        vm.meskey5 = "SAV-P/V-CONF-MSS_006";
                        vm.meskey6 = "vide";
                        vm.meskey7 = "vide";
                        recordLossTheftSepa().then(
                        		function () {
                        			$scope.validatedDeclaration = true;
                        		})
                        .catch(error);
                    break;

                    default:
                        $log.log("DEFAULT");
                        vm.meskey = "vide";
                    break;
                }
            }

            var getReference = function() {

                return initData.user[0].reference;
            };

            var getContractReference = function() {

                return initData.contrat[0].reference;
            };

            var getCodeProduit = function() {

                return initData.contrat[0].codeProduit;
            };

            var getMail = function() {

                return initData.user[0].email;
            };

            var  getSendDate = function() {

                return addOpenDay((new Date), 7);
            };

            var getBuyAmount = function() {

                return 23;
            };

            var addOpenDay = function(date, days) {
                var tomorrow = new Date(date);
                for (var i = 0 ; i < days ; i++) {
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    if (tomorrow.getDay() == 0 || tomorrow.getDay() == 6){
                        i--;
                    }
                }

                return tomorrow;
            };

            var recordLossTheftSepa = function() {
                var expose = $q.defer();

                var params = {
                    "referenceSig": getReference(),
                    "refContrat":   getContractReference(),
                    "codeProduit":  getCodeProduit(),
                    "successUrl":   "",
                    "failureUrl":   "",
                    "cancelUrl":    ""
                };

                var url = "api/deed/save/loss/theft.json";
                $rootScope.$broadcast("sendRequest");
                $http
                .post(url, params)
                .success(
                    function(data){
                        $rootScope.$broadcast("receiveResponse");
                        if (initData.contrat[0].NBMAX_IR) {
                            initData.typeError.error = 'V-LIM-EC02';
                            $location.path('/perte_vol_erreur');
                            expose.reject("nombre de remplacement dépassé");
//                            return expose.promise;
                        }
                        if (!data.ok4Payment || !data.ok4Payment.allOk ) {
                            expose.reject("erreur désactivation");
                        }
                        expose.resolve(data);
                    }
                )
                .error(
                    function(msg){
                        $rootScope.$broadcast("receiveResponse");
                        expose.reject(msg);
                    }
                );

                return expose.promise;
            };

            this.stepSubmit = function() {
                window.location.hash = "";
                window.location = "espace_client";
            };

            resetCtrl();
        }
    ])
})();
