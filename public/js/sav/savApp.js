/*********************************************************************************************************
 * init config
 *********************************************************************************************************/
angular.module("SAV", ['ngRoute', 'ngFileUpload', 'ngResource', 'module.savLoadingPageData', 'Common'])
    //--------------------------------
    // main CONTROLLER
    .controller("SavCtrl",
    ["$log", "initData", "$location", "SigClientModel",
        function ($log, initData, $location, SigClientModel) {

        $log.log(":: initData acte ", initData.acte);
        $log.log(":: initData ", initData);
        $log.log(":: initData SIG Reference "+ initData.user[0].reference);
        $log.log(":: initData TYPE "+ initData.type );
        $log.log(":: initData contrat "+ initData.contrat );
        //$log.log(":: initData sig "+ initData.userSig[0].reference );

        SigClientModel.model.reference = initData.user[0].reference;
        var routeTab = {
            'pertevol': 'perte_vol_declaration',
            'attestation': 'attestation'
        };


        // Route vers le bon acte SAV :
        if (initData.acte) {
            $location.path('/' + routeTab[initData.acte]);
        } else {
            window.location = "./";
        }
    }])


    // CONFIG
    .config([
        '$logProvider',
        '$sceDelegateProvider',
        '$routeProvider',
        '$locationProvider',
        function ($logProvider, $sceDelegateProvider, $routeProvider, $locationProvider) {

            //------------------------
            // Affiche ou non les logs :
            $logProvider.debugEnabled(true);

            $sceDelegateProvider
                .resourceUrlWhitelist([
                    'self',
                    'https://www.google.com'
                ]);

            $routeProvider
                .when('/redirect', {
                    template: "<h1>Redirection vers l'accueil</h1>",
                    controller: function () {
                        //window.location = "/";
                    },
                    controllerAs: 'profil'
                })
                .when('/attestation', {
                    templateUrl: "api/template/Sav/attestation.html",
                    controller: "AttestationCtrl as pageCtrl",
                    resolve:{
                        cas:["$q", "initData",function($q ,initData){
                            /* La vue est accessible depuis 2 points d'entrée - Home connecté & - Espace Client
                             1) cas - Depuis "Home connecté" - l'user clique sur "Telecharger attestation"
                             depuis les zones de type de contrats. J'affiche alors la liste complète des contrats
                             lié a une Ref Sig et un type de contrat(si ils existent).
                             - la variable contrat est 0 .

                             2) cas - Depuis "Espace Client" - j'affiche directement le contrat depuis le lien
                             "Telecharger l'attestation PDF" qui contient la ref du contrat.
                             - la variable contrat est renseignée (son numéro).                             */
                            var result_cas = "";
                            if (parseInt(initData.refContrat) === 0){
                                result_cas = "cas1";
                            }
                            else {
                                result_cas = "cas2";
                            }

                            return $q.when(result_cas);
                        }
                    ]}
                })
                .when('/perte_vol_declaration', {//pertevol
                    templateUrl: 'api/template/Sav/declaration.html',
                    controller: "DeclarationCtrl as pageCtrl",
                    resolve: {
                        check: function ($location, $log, Resource, initData) {
                            $log.log(Resource);
                            if (initData.typeError.error || !initData.contrat.length || initData.contrat[0] == null) {
                                $location.path('/perte_vol_erreur');

                                return;
                            }

                            if (initData.page.page) {
                                $location.path('/' + initData.page.page);

                                return;
                            }
                        }
                    }
                })
                .when('/perte_vol_erreur', { //declarationStop
                    templateUrl: 'api/template/Sav/declarationFail.html',
                    controller: "ErrorCtrl as pageCtrl"
                })
                .when('/perte_vol_confirmation', {//Confirmation
                    templateUrl: "api/template/Sav/confirmation.html",
                    controller: "ConfirmationCtrl",
                    controllerAs: 'pageCtrl'
                })
                .when('/perte_vol_verification_coordonnees', {//Coordonnees
                    templateUrl: "api/template/Sav/coordonnees.html",
                    controller: 'CoordonneesCtrl',
                    controllerAs: 'pageCtrl'
                })
                .when('/perte_vol_moyen_de_paiement', {//Paiement
                    templateUrl: "api/template/Sav/paiement.html",
                    controller:  'PaymentCtrl',
                    controllerAs: 'pageCtrl'
                })
                .when('/perte_vol_echec_paiement', {//Paiement
                    templateUrl: "api/template/Sav/perte_vol_echec_paiement.html"
                })
                .when('/perte_vol_annulation_paiement', {//Paiement
                    templateUrl: "api/template/Sav/perte_vol_annulation_paiement.html"

                });


            $locationProvider
                .html5Mode(false);
        }
    ]);
