(function(){
    //"use strict";

    angular.module("SAV").controller("PaymentCtrl", [
        "SigClientModel", "SigSavForfaitModel", "$http", "$scope", "$rootScope", "initData", "$log", '$location', 'monthName', '$q', 'Wording',
        function(SigClientModel, SigSavForfaitModel, $http, $scope, $rootScope, initData, $log, $location, monthName, $q, Wording) {
            var vm = this;

            var resetCtrl = function() {
                vm.buttonMessageTitle = Wording.get('pv.pv_paiement.bt_ok_title');
                vm.buttonMessage = Wording.get('pv.pv_paiement.bt_ok_msg');
                getCase();
            }

            var userPayBySepa = function() {
                if (initData.contrat[0].situationFinanciere.modePaiement == "Prélevement") {
                    return true;
                }

                return false;
            }

            var guessCase = function() {
                vm.bySepa = userPayBySepa();
                var day = (new Date()).getDate();

                if(vm.bySepa && day < 21) {

                    return "BEFORE21";
                }

                if (vm.bySepa && day >= 21) {

                    return  "AFTER21";
                }

                if (!vm.bySepa) {

                    return  "CB";
                }

                return "default";
            }

            var nextCase = function(useCase) {
                switch (useCase) {
                    case "BEFORE21":
                        $rootScope.pv_paymentMethod = "SEPA";
                        displaySepaBefore21Message();

                    break;
                    case "AFTER21":
                        $rootScope.pv_paymentMethod = "SEPA";
                        displaySepaAfter21Message();
                    break;
                    case "CB":
                        $rootScope.pv_paymentMethod = "CB";
                        displayCbMessage();
                    break;

                    case "BEFORE21_SUBMIT":
                    case "AFTER21_SUBMIT":
                        gotoConfirmation();
                    break;
                    case "CB_SUBMIT":
                        if (vm.mustPay) {
                            gotoPayline();
                        } else {
                            $rootScope.pv_useCase = "PAYER_CB_WITHOUT_PAYMENT";
                            gotoConfirmation();
                        }
                    break;

                    default:
                        $log.log("DEFAULT");
                    break;
                }
            }

            var getCase = function() {
                vm.useCase = guessCase();
                nextCase(vm.useCase);
            }

            var getNextStep = function() {
                var prev = null;
                var current = null;
                for (var step in $rootScope.progressBar) {
                    current = $rootScope.progressBar[step];
                    if (!prev || prev.index < current.index) {
                        prev = current;
                    }
                }

                return prev;
            }


            var getNextStandingOrder = function() {
                if(!initData.contrat || !initData.contrat[0] || !initData.contrat[0].situationFinanciere || !initData.contrat[0].situationFinanciere.montantProchainPrelevement) {
                    return false;
                }

                return initData.contrat[0].situationFinanciere.montantProchainPrelevement;
            }

            /**
             * return name of the current month + numberMonth
             */
            var getOrderMonthName = function(numberMonth) {
                return monthName.fr[((new Date()).getMonth() + numberMonth) % 12];
            }


            var getReference = function() {

                return initData.contrat[0].numeroPorteur || initData.user[0].reference;
            };


            var getContractReference = function() {

                return initData.contrat[0].reference;
            };

            var getCodeProduit = function() {

                return initData.contrat[0].codeProduit;
            };

            var displaySepaBefore21Message = function() {
                vm.nextStandingOrder = getNextStandingOrder();
                $scope.deedPrice = "...";
                $scope.standingOrder = "...";//wait request
                $scope.orderMonthName = getOrderMonthName(2);
                vm.meskey =   "SAV-PV-PRE-MSS_001";//require deedPrice, orderMonthName
                vm.meskey2 =  "SAV-PV-PRE-MSS_002";//require standingOrder
                vm.meskey3 =  "SAV-PV-PRE-MSS_003";
                requestDeedPrice()
                .then(
                    function(amounts){
                        $scope.deedPrice = amounts.deedPrice;
                        $scope.standingOrder = vm.nextStandingOrder + amounts.deedPrice;//wait request
                    },
                    function(msg){
                        $log.log("error: " + msg);
                        $scope.error = Wording.get('pv.pv_paiement.absence_montant_err');
                    }
                )
            };

            var displaySepaAfter21Message = function() {
                $scope.deedPrice = "...";
                $scope.orderMonthName = getOrderMonthName(2);
                vm.meskey =   "SAV-PV-PRE-MSS_001";//require deedPrice, orderMonthName
                vm.meskey2 =  "SAV-PV-PRE-MSS_003";
                requestDeedPrice()
                .then(
                    function(amounts){
                        $scope.deedPrice = amounts.deedPrice;
                    },
                    function(msg){
                        $log.log("error: " + msg);
                        $scope.error = Wording.get('pv.pv_paiement.absence_montant_err');
                    }
                )
            };

            var displayCbMessage = function() {
                $scope.deedPrice = '...';
                $scope.netPrice = '...';
                vm.meskey =   "SAV-P/V-PPA-MSS_001_DOCA";//require deedPrice
                vm.meskey2 = "";

                requestDeedPrice()
                .then(
                    function(amounts) {
                        if (amounts.netPrice === null) {
                            $log.log("error: absence netPrice");
                            $scope.error = Wording.get('pv.pv_paiement.absence_montant_err');
                            return;
                        }
                        $scope.deedPrice = amounts.deedPrice;
                        $scope.netPrice = amounts.netPrice;
                        vm.meskey2 = amounts.netPrice > 0
                            ? "SAV-P/V-PPA-MSS_002_DOCA"
                            : "SAV-P/V-PPA-MSS_003_DOCA";
                        vm.mustPay = amounts.netPrice > 0;
                        //$scope.standingOrder = vm.nextStandingOrder + deedPrice;//wait request
                    },
                    function(msg) {
                        $log.log("error: " + msg);
                        $scope.error = Wording.get('pv.pv_paiement.absence_montant_err');
                    }
                )
            };

            var recordPayment = function(evaluation, serieNumber) {
                var expose = $q.defer();
                var params = {
                    "refPasse": serieNumber,
                    "codeMotifRemplacement": 145,
                    "referenceContratCommercial": initData.contrat[0].reference,
                    "codeProduit": initData.contrat[0].codeProduit,
                    "codeMoyenPaiement": initData.contrat[0].situationFinanciere.modePaiementCode,
                    "montant": evaluation ? "" : vm.deedPrice.explode('.').join('').explode(',').join(''),
                    "modeEvaluation": evaluation
                }

                var url = "api/sig/demander/remplacement/dde/client.json";
                $rootScope.$broadcast("sendRequest");
                $http.post(url, params)
                .success(
                    function(data){
                        $rootScope.$broadcast("receiveResponse");
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

            var requestDeedPrice = function() {

                var expose = $q.defer();
                var params = {
                    "referenceSig": initData.contrat[0].numeroPorteur || initData.user[0].reference,
                    "refContrat":   initData.contrat[0].reference,
                    "codeProduit":   initData.contrat[0].codeProduit
                }

                var url = "api/deed/loss/theft/amount.json";
                $rootScope.$broadcast("sendRequest");
                $http.get(url, {"params" : params})
                .success(
                    function(data){
                        $rootScope.$broadcast("receiveResponse");
                        if(!data.lossTheftAmount) {
                            expose.reject(data.data.message);
                        }
                        expose.resolve({
                                "deedPrice" : data.lossTheftAmount,
                                "netPrice": data.netPrice
                        });
                    }
                )
                .error(
                    function(msg){
                        $rootScope.$broadcast("receiveResponse");
                        expose.reject(msg);
                    }
                );

                return expose.promise;
            }

            var recordLossTheftCb = function() {
                var params = {
                    "referenceSig": getReference(),
                    "refContrat":   getContractReference(),
                    "codeProduit":  getCodeProduit(),
                    "successUrl":   window.location.origin + window.location.pathname + "?landingPage=perte_vol_confirmation",
                    "failureUrl":   window.location.origin + window.location.pathname + "?landingPage=perte_vol_echec_paiement",
                    "cancelUrl":    window.location.origin + window.location.pathname + "?landingPage=perte_vol_annulation_paiement"
                }

                var expose = $q.defer();

                var url = "api/deed/save/loss/theft.json";
                $rootScope.$broadcast("sendRequest");
                $http.post(url, params)
                .success(
                    function(data){
                        $rootScope.$broadcast("receiveResponse");
                        if (!data.ok4Payment || !data.ok4Payment.allOk || !data.ok4Payment.payline.redirectURL) {
                            expose.reject("Erreur clé à définir");
                        }
                        expose.resolve(data);
                    }
                )
                .error(
                    function(data){
                        $rootScope.$broadcast("receiveResponse");
                        expose.reject("Erreur clé à définir 22");
                    }
                );

                return expose.promise;
            };

            var gotoPayline = function() {
                recordLossTheftCb()
                .then(
                    function(data){
                        $log.log(data);
                        window.location = data.ok4Payment.payline.redirectURL;
                    },
                    function(msg){
                        $log.log("Error: " + msg);
                    }
                )
            };

            var gotoConfirmation = function() {
                $location.path('/perte_vol_confirmation');
                return;
            }

            this.stepSubmit = function() {
                vm.useCase += "_SUBMIT";
                nextCase(vm.useCase);
            };

            resetCtrl();
        }
    ])
})();
