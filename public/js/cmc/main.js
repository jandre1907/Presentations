/*********************************************************************************************************
 * init App
 *********************************************************************************************************/
CMC.CtrlAndDependencies = function (controller) {
    var defaultCtrlDependencies = [
        '$scope',
        '$io',
        '$location',
        '$sce',
        '$route',
        '$routeParams',
        '$compile',
        'Upload',
        '$q',
        '$cookieStore',
        'Wording'
    ];
    defaultCtrlDependencies.push(controller);

    return defaultCtrlDependencies;
};

CMC.MODEL = new CMC.Model();
//CMC.MSG = new CMC.MODEL.Messages(CMC.lang);
CMC.TITLES = new CMC.MODEL.Titles(CMC.lang);
CMC.CTRL = new CMC.Controllers();
CMC.DIR = new CMC.Directives();
SEL.MODEL = new SEL.Model();


/*********************************************************************************************************
 * init config
 *********************************************************************************************************/
CMC.app = angular.module("CMC", ['ngRoute', 'ngFileUpload', 'ngCookies', 'angularSpinner', 'Rattachement', 'Common'])
    .config(
    ['$sceDelegateProvider', '$routeProvider', '$locationProvider', '$logProvider',
        function ($sceDelegateProvider, $routeProvider, $locationProvider, $logProvider) {


            // Affiche ou non les logs :
            $logProvider.debugEnabled(true);

            $sceDelegateProvider
                .resourceUrlWhitelist([
                    'self',
                    'https://www.google.com'
                ]);

            $routeProvider
                .when('/Profil', {
                    templateUrl: 'api/template/Cmc/profil.html',
                    controller: CMC.CTRL.ProfilCtrl,
                    controllerAs: 'profil'
                })
                .when('/Porteur', {
                    templateUrl: 'api/template/Cmc/porteur.html',
                    controller: CMC.CTRL.PorteurCtrl,
                    controllerAs: 'porteur'
                })
                .when('/Photo', {
                    templateUrl: 'api/template/Cmc/photo.html',
                    controller: "PhotoCtrl as photoCtrl",
                    resolve: {
                        stepLoad: ["CrtOrUptCardOrderModel", function (CrtOrUptCardOrderModel) {
                            return CrtOrUptCardOrderModel.loadStep(1, 0);
                        }]
                    }
                })
                .when('/Recapitulatif', {
                    templateUrl: 'api/template/Cmc/recapitulatif.html',
                    controller: 'RecapitulatifCtrl as recapCtrl',
                    resolve: {
                        stepLoad: ["CrtOrUptCardOrderModel", function (CrtOrUptCardOrderModel) {
                            return CrtOrUptCardOrderModel.loadStep(2, 1);
                        }]
                    }
                })
                .when('/Identification', {
                    templateUrl: 'api/template/Cmc/identification.html',
                    controller: 'IdentificationCtrl as identificationCtrl'
                })
                .when('/IdentificationSuite', {
                    templateUrl: 'api/template/Cmc/identificationSuite.html',
                    controller: 'IdentificationSuiteCtrl as identificationSuiteCtrl'
                })
                .when('/IdentificationFin', {
                    templateUrl: 'api/template/Cmc/identificationFin.html',
                    controller: 'IdentificationFinCtrl as pageCtrl'
                })
                .when('/echec_identification', {
                    templateUrl: 'api/template/Cmc/identificationFailure.html',
                    controller: 'IdentificationFailureCtrl as pageCtrl'
                })
                .when('/IdentificationHelp', {
                    templateUrl: 'api/template/Common/identificationHelp.html',
                    controller: 'IdentificationHelpCtrl as pageCtrl'
                })
                .when('/Confirmation', {
                    templateUrl: 'api/template/Cmc/confirmation.html',
                    controller: 'ConfirmationCtrl as pageCtrl'
                })

                .otherwise({
                    redirectTo: CMC.defaultRoute
                });
            $locationProvider
                .html5Mode(false);
        }]
);

/********SERVICES*******/
CMC.app.service("$sender", ['$http', CMC.MODEL.Sender]);
CMC.app.service("$io", ['$q', '$sender', '$rootScope', 'ServerProcessError', CMC.IO]);


/*******FILTER*********/
angular.module("CMC")
    .filter("civiliteFtr", [CMC.MODEL.civiliteFtr])
    .filter("dateFormatStr", [CMC.MODEL.dateFormatStr])
    .filter("dateFormatStrStandart", [CMC.MODEL.dateFormatStrStandart]);


/*********************************************************************************************************
 * using App
 *********************************************************************************************************/
CMC.app.controller('Throbber', ['$rootScope', '$scope', CMC.CTRL.Throbber]);
CMC.app.controller('MainCtrl', CMC.CtrlAndDependencies(CMC.CTRL.MainCtrl));
CMC.app.controller('TitleCtrl', ['$scope', '$io', '$location', '$sce', '$route', '$routeParams', '$compile', 'Upload', '$q', '$cookieStore', CMC.CTRL.TitleCtrl]);
CMC.app.controller('ProfilCtrl',['$scope', '$io', '$location','$log', '$q', CMC.CTRL.ProfilCtrl]);
CMC.app.controller('PorteurCtrl', ['$scope', '$io', '$location', '$q', '$filter', '$log', 'Normalization', 'Wording', CMC.CTRL.PorteurCtrl]);
CMC.app.controller('IdentificationCtrl',['$scope', '$io', '$location', '$sce', '$route', '$routeParams', '$compile', 'Upload', '$q', 'rattachementSearch', '$log', 'Wording', CMC.CTRL.IdentificationCtrl]);
CMC.app.controller('IdentificationSuiteCtrl', ['$scope', '$io', '$location','$q','$filter','rattachementSearch', '$filter', '$log', 'Wording', CMC.CTRL.IdentificationSuiteCtrl]);
CMC.app.controller('IdentificationFinCtrl', ['$scope', '$location', 'Wording', CMC.CTRL.IdentificationFinCtrl]);
CMC.app.controller('PhotoCtrl', ['$rootScope', '$scope', '$location', '$http', 'Upload', '$log', 'Wording', CMC.CTRL.PhotoCtrl]);
CMC.app.controller('RecapitulatifCtrl', ['$scope', '$rootScope','$io', '$location' , '$q', 'CrtOrUptCardOrderModel','$log','$http', 'Wording', CMC.CTRL.RecapitulatifCtrl]);
CMC.app.controller('IdentificationFailureCtrl', ['$scope', '$sce', '$location', 'Wording', CMC.CTRL.IdentificationFailureCtrl]);
CMC.app.controller('ConfirmationCtrl', ['$scope', '$window', CMC.CTRL.ConfirmationCtrl]);


// CMC.app.controller('BreadcrumbCtrl', CMC.CtrlAndDependencies(CMC.CTRL.BreadcrumbCtrl));
CMC.app.controller('BreadcrumbCtrl', ['$scope', '$rootScope', '$location', CMC.CTRL.BreadcrumbCtrl]);

//CMC.app.controller('SuperCtrl', CMC.CtrlAndDependencies(CMC.CTRL.SuperCtrl));
// CMC.app.controller('FormulaireCtrl', CMC.CtrlAndDependencies(CMC.CTRL.FormulaireCtrl));
// CMC.app.controller('DetailCtrl', CMC.CtrlAndDependencies(CMC.CTRL.DetailCtrl));
// CMC.app.controller('IdentificationHelpCtrl', CMC.CtrlAndDependencies(CMC.CTRL.IdentificationHelpCtrl));
// CMC.app.controller('ConnexionHelpCtrl', CMC.CtrlAndDependencies(CMC.CTRL.ConnexionHelpCtrl));
// CMC.app.controller('CoordonneesCtrl', CMC.CtrlAndDependencies(CMC.CTRL.CoordonneesCtrl));
// CMC.app.controller('TestCtrl', CMC.CtrlAndDependencies(CMC.CTRL.TestCtrl));

/*********DIRECTIVE*****/
CMC.app.directive('selPassword', CMC.DIR.selPassword);
