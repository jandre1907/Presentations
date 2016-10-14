(function () {
    "use strict";

    angular.module("SAV")
        .controller("AttestationCtrl", [
            "$scope", "$log", "$window", "$location", "cas", "initData", "SigCourrierModel","$rootScope",
            function ($scope, $log, $window, $location, cas, initData, SigCourrierModel, $rootScope) {
                //*********************************
                /*
                 Cette vue est accessible depuis 2 points d'entrée :
                 - Home connecté
                 - Espace Client

                 1) cas - Depuis "Home connecté" - l'user clique sur "Telecharger attestation"
                 depuis les zones de type de contrats. J'affiche alors la liste complète des contrats
                 lié a une Ref Sig et un type de contrat.
                 - la variable contrat est 0 .

                 2) cas - Depuis "Espace Client" - j'affiche directement le contrat depuis le lien
                 "Telecharger l'attestation PDF" qui contient la ref du contrat.
                 - la variable contrat est renseignée (son numéro).
                 */
                //*********************************

                var vm = this;
                vm.isForfaits   = true; // affiche la liste de choix attestation
                vm.isError      = false;// ...
                vm.pdfOnNewTab  = false;// message : informe l'utilisateur que le PDF est sur un nouvel onglet

                // Flag : affiche la date validité contrats
                // 1 & 2 pour imaginaire scolaire & étudiant.
                vm.displayDateContrat = false;
                if (parseInt(initData.type) === 1 || parseInt(initData.type) === 2) {
                    vm.displayDateForfait = true;
                }

                switch (cas) {
                    case "cas1":
                        vm.afficheWordingSelection = true;
                        cas1();
                        break;

                    case "cas2":
                        vm.afficheWordingSelection = false;
                        cas2();
                        break;
                }
                //*********************************
                // CAS 1
                //*********************************
                function cas1() {
                    // Cas 1) - depuis "Home connecté" :
                    $log.log("Cas 1)");
                    $rootScope.$broadcast("sendRequest");
                    SigCourrierModel.getContratCollection(initData.user[0].reference, initData.type)
                        .then(function (response) {
                            $rootScope.$broadcast("receiveResponse");
                            // Affiche les contrats si dispo !
                            vm.isForfaits = SigCourrierModel.isContrats;
                            vm.contratCollec = SigCourrierModel.collection;
                        },
                        // Fail
                        function (err) {
                            vm.isError = true;
                            $log.log(" Attestation Controller cas 1 - FAIL " , err);
                        })
                }


                //*********************************
                // CAS 2
                //*********************************
                function cas2() {
                    // Cas 2) - depuis "Espace Client"
                    $log.log("Cas 2)");
                    //$log.log( initData );
                    $rootScope.$broadcast("sendRequest");

                    SigCourrierModel.getContratPdfUrl(initData.user[0].reference, initData.refContrat, initData.type)
                        .then(function (response) {
                            $rootScope.$broadcast("receiveResponse");
                            if(SigCourrierModel.isAttestation){
                                vm.pdfOnNewTab = true;
                                //$window.open(response, '_blank');
                                // response = object attestation
                                $scope.forfait = response;
                                $log.log( $scope.forfait );

                            } else {
                                // il peut arriver qu'il n'y ait pas d'attestations
                                // pour un contrat :
                                vm.isForfaits = false;
                            }
                        },
                        // Fail :
                        function (err) {
                            vm.isError = true;
                            $log.log(" Attestation Controller cas 2 - FAIL " , err);
                        })
                }

                // Click bouton télécharger :
                // (avant) Appelle le PDF et l'affiche dans un nouvel onglet :
                    // ( maintenant !)- remplacé par l'url dans le href de la balise <a>
                    // -- voir le template pour revenir a la premiere solution ci-dessous (le PDF s'affiche dans une nouvelle tab)--
                vm.onTelecharger = function (urlContratPDF) {
                    $log.log("urlContratPDF " + urlContratPDF);
                    $window.open(urlContratPDF, '_blank');
                    return;
                };

                //--------------------
                // Bouton click: retour vers votre espace :
                vm.onRetourEspace = function () {
                    // TODO : (LV) Avoir un lien clean provenant de la page twig en parametre ?.
                    var espaceClientUrl = $location.absUrl().split('#')[0].split("/sav")[0] + "/espace_client";
                    $window.location = espaceClientUrl;
                };
            }])
})();
