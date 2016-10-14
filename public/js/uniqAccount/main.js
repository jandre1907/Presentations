/*********************************************************************************************************
 * init App
 *********************************************************************************************************/
CX.CtrlAndDependencies = function (controller) {
    var defaultCtrlDependencies = [
        '$scope',
        '$location',
        '$http',
        '$sce',
        '$route',
        '$routeParams',
        '$compile',
        'Upload',
        '$q',
        '$filter',
        'Wording'
    ];
    defaultCtrlDependencies.push(controller);

    return defaultCtrlDependencies;
}

CX.MODEL = new CX.Model();
// CX.CUSTOMER = new CX.MODEL.Customer();
CX.STEP = new CX.MODEL.Step();
CX.MSG = new CX.MODEL.Messages(CX.lang);
CX.TITLES = new CX.MODEL.Titles(CX.lang);
CX.CTRL = new CX.Controllers();
CX.DIR = new CX.Directives();

/*********************************************************************************************************
 * init config
 *********************************************************************************************************/

CX.app = angular.module("CX",['ngRoute', 'ngFileUpload', 'angularSpinner', 'Common'],

    function ($httpProvider) {
        // Use x-www-form-urlencoded Content-Type
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function (obj) {
            var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

            for (name in obj) {
                value = obj[name];

                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if (value !== undefined && value !== null)
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };

        // Override $http service's default transformRequest
        $httpProvider.defaults.transformRequest = [function (data) {
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];
    }
)
    .config(
    ['$sceDelegateProvider', '$routeProvider', '$locationProvider', function ($sceDelegateProvider, $routeProvider, $locationProvider) {
        $sceDelegateProvider
            .resourceUrlWhitelist([
                'self',
                'https://www.google.com'
            ]);

        $routeProvider




            .when('/saisie_donnees_client', {
                templateUrl: 'formulaire',
                controller: CX.CTRL.FormulaireCtrl,
                controllerAs: 'formulaire'
            })
            .when('/donnees_complementaires', {
                templateUrl: 'formulaire_detail',
                controller: CX.CTRL.DetailCtrl,
                controllerAs: 'detail'
            })
            .when('/confirmation_creation_espace', {
                templateUrl: 'confirmation',
                controller: CX.CTRL.ConfirmationCtrl,
                controllerAs: 'confirmation'
            })
            .when('/selection_identite', {
                templateUrl: 'formulaire_multiple',
                controller: CX.CTRL.MultipleCtrl,
                controllerAs: 'pageCtrl'
            })
            .when('/ou_trouver_numero_client', {
                templateUrl: "api/template/Common/identificationHelp.html",
                controller: 'IdentificationHelpCtrl'
                //controllerAs: 'identificationHelp'
            })
            .when('/echec_identification', {
                templateUrl: 'identificationFailure',
                controller: CX.CTRL.IdentificationFailureCtrl,
                controllerAs: 'pageCtrl'
            })
            .when('/verification_coordonnees', {
                //templateUrl: 'con.html',
                controller: CX.CTRL.VerificationCtrl,
                controllerAs: 'verification'
            })
            .when('/lien_activation_expire', {
                templateUrl: 'TODO',
                // controller: CX.CTRL.ExpirationLienCtrl,
                // controllerAs: 'confirmation'
            })
            .when('/lien_activation_deja_utilise', {
                templateUrl: 'TODO',
                // controller: CX.CTRL.ExpirationLienCtrl,
                // controllerAs: 'confirmation'
            })
            .when('/demande_interdite', {
                templateUrl: 'TODO',
                // controller: CX.CTRL.ExpirationLienCtrl,
                // controllerAs: 'confirmation'
            })
            // .when('/Coordonnees', {
            //     templateUrl: 'confirmation'
            //     // controller: CX.CTRL.ConfirmationCtrl,
            //     // controllerAs: 'confirmation'
            // })
            // .when('/EspaceClient', {
            //     templateUrl: 'confirmation'
            //     // controller: CX.CTRL.ConfirmationCtrl,
            //     // controllerAs: 'confirmation'
            // })
            // .when('/ModifierCoordonnees', {
            //     templateUrl: 'confirmation'
            //     // controller: CX.CTRL.ConfirmationCtrl,
            //     // controllerAs: 'confirmation'
            // })
            // .when('/ModifierEmail', {
            //     templateUrl: 'confirmation'
            //     // controller: CX.CTRL.ConfirmationCtrl,
            //     // controllerAs: 'confirmation'
            // })
            // .when('/ModificationMailok', {
            //     templateUrl: 'confirmation'
            //     // controller: CX.CTRL.ConfirmationCtrl,
            //     // controllerAs: 'confirmation'
            // })
            // .when('/ModifierMotDePasse', {
            //     templateUrl: 'confirmation'
            //     // controller: CX.CTRL.ConfirmationCtrl,
            //     // controllerAs: 'confirmation'
            // })
           // .when('/ConnexionHelp', {
           //      templateUrl: 'connexionHelp.html',
           //      controller: CX.CTRL.ConnexionHelpCtrl,
           //      controllerAs: 'connexionHelp'
           //  })
            // .when('/ModificationMdpOk', {
            //     templateUrl: 'confirmation',
            //     // controller: CX.CTRL.ConfirmationCtrl,
            //     // controllerAs: 'confirmation'
            // })
            // .when('/ModificationMdpOk', {
            //     templateUrl: 'ModificationMdpOk',
            //     // controller: CX.CTRL.ModificationMdpOkCtrl,
            //     // controllerAs: 'confirmation'
            // })
            // .when('/OublieMdp', {
            //     templateUrl: 'OublieMdp',
            //     // controller: CX.CTRL.OublieMdpCtrl,
            //     // controllerAs: 'confirmation'
            // })
            // .when('/emailMdpConfirmation', {
            //     templateUrl: 'emailMdpConfirmation',
            //     // controller: CX.CTRL.emailMdpConfirmationCtrl,
            //     // controllerAs: 'confirmation'
            // })
            // .when('/reinitialisationMdp', {
            //     templateUrl: 'reinitialisationMdp',
            //     // controller: CX.CTRL.reinitialisationMdpCtrl,
            //     // controllerAs: 'confirmation'
            // })
            // .when('/reinitialisationOk', {
            //     templateUrl: 'reinitialisationOk',
            //     // controller: CX.CTRL.reinitialisationOkCtrl,
            //     // controllerAs: 'confirmation'
            // })
            // .when('/NumeroClient', {
            //     templateUrl: 'NumeroClient',
            //     // controller: CX.CTRL.NumeroClientCtrl,
            //     // controllerAs: 'confirmation'
            // })//script
            // .when('/Rattachement', {
            //     templateUrl: 'Rattachement',
            //     // controller: CX.CTRL.RattachementCtrl,
            //     // controllerAs: 'confirmation'
            // })
            // .when('/EchecRattachement', {
            //     templateUrl: 'EchecRattachement',
            //     // controller: CX.CTRL.EchecRattachementCtrl,
            //     // controllerAs: 'confirmation'
            // })//script
            // .when('/Echec', {
            //     templateUrl: 'Echec',
            //     // controller: CX.CTRL.EchecCtrl,
            //     // controllerAs: 'confirmation'
            // })//script
            // .when('/Verification', {
            //     //templateUrl: 'Verification',
            //     controller: CX.CTRL.VerificationCtrl,
            //     controllerAs: 'verification'
            // })
            // .when('/Test', {
            //     templateUrl: 'test',
            //     // controller: CX.Controllers.prototype.FormulaireCtrl,
            //     controllerAs: 'test'
            // })
            .otherwise({
                redirectTo: CX.defaultRoute
            });
        $locationProvider
            .html5Mode(false);
    }]
);

/*******FILTER*********/
angular.module("CX")
    .filter("dateFormat", [CX.MODEL.dateFormat]);

/*********************************************************************************************************
 * using App
 *********************************************************************************************************/
CX.log(CX.CTRL.MainCtrl);
CX.log(CX.CTRL.FormulaireCtrl);
CX.app.controller('MainCtrl', CX.CtrlAndDependencies(CX.CTRL.MainCtrl));
CX.app.controller('TitleCtrl',
    ['$scope', '$location', '$http', '$sce', '$route', '$routeParams', '$compile', 'Upload', '$q', 'Wording', CX.CTRL.TitleCtrl]
);

CX.app.controller(
    'VerificationCtrl',
    ['$scope',
        '$location',
        '$http',
        '$q',
        'Wording',
        'Normalization',
        'forcePattern',
        '$rootScope',
        CX.CTRL.VerificationCtrl
    ]
);

CX.app.controller('FormulaireCtrl',
    ['$scope',
        '$location',
        '$http',
        '$q',
        'Wording',
        'Normalization',
        'forcePattern',
        '$rootScope',
        'isDateValid',
        CX.CTRL.FormulaireCtrl
    ]
);

CX.app.controller(
    'DetailCtrl',
    ['$scope',
        '$location',
        '$filter',
        'Wording',
        'forcePattern',
        'isDateValid',
        CX.CTRL.DetailCtrl
    ]
);
//CX.app.controller('DetailCtrl', CX.CtrlAndDependencies(CX.CTRL.DetailCtrl));
CX.app.controller('ConnexionHelpCtrl', CX.CtrlAndDependencies(CX.CTRL.ConnexionHelpCtrl));
CX.app.controller('CoordonneesCtrl', CX.CtrlAndDependencies(CX.CTRL.CoordonneesCtrl));
CX.app.controller('MultipleCtrl', CX.CtrlAndDependencies(CX.CTRL.MultipleCtrl));

// CX.app.controller('TestCtrl', CX.CtrlAndDependencies(CX.CTRL.TestCtrl));
/*********DIRECTIVE*****/
CX.app.directive('selPassword', CX.DIR.selPassword);
