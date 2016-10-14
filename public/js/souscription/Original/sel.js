/*********************************************************************************************************
 * init App
 *********************************************************************************************************/
SEL.MODEL = new SEL.Model();
SEL.HOLDER = SEL.MODEL.Holder;
SEL.ID_FORM = SEL.MODEL.id_form;
SEL.CART = SEL.MODEL.cartDefault;
SEL.VIEW = new SEL.View();
SEL.APP = new SEL.App();

SEL.VIEW.log("SEL.VIEW ok");
SEL.MODEL.log("SEL.MODEL ok");
SEL.APP.log("SEL.APP ok");


/*********************************************************************************************************
 * init config
 *********************************************************************************************************/

SEL.appSel = angular.module("SEL",['ngRoute', 'ngFileUpload', 'ngCookies', 'Rattachement', 'Common', 'Souscription'])
.config(
    ['$sceDelegateProvider', '$routeProvider', '$locationProvider', function($sceDelegateProvider, $routeProvider, $locationProvider) {
        $sceDelegateProvider
            .resourceUrlWhitelist([
                'self'
            ]);

        $routeProvider
            .when('/Profil', {
                templateUrl: 'api/template/Souscription/profil.html',
                controller: SEL.APP.ProfilCtrl,
                controllerAs: 'profil'
            })
            .when('/Rattachement', {
                templateUrl: 'api/template/Souscription/rattachement.html',
                controller: SEL.APP.RattachementCtrl,
                controllerAs: 'rattachement'
            })
            .when('/Identification', {
                templateUrl: 'api/template/Souscription/identification.html',
                controller: SEL.APP.IdentificationCtrl,
                controllerAs: 'identification'
            })
            .when('/IdentificationHelp', {
                templateUrl: 'api/template/Common/identificationHelp.html',
                controller: 'IdentificationHelpCtrl',
                controllerAs: 'identificationHelp'
            })
            .when('/ConnexionHelp', {
                templateUrl: 'api/template/Souscription/connexionHelp.html',
                controller: SEL.APP.ConnexionHelpCtrl,
                controllerAs: 'connexionHelp'
            })
            .when('/IdentificationSuite', {
                templateUrl: 'api/template/Souscription/identificationSuite.html',
                controller: SEL.APP.IdentificationSuiteCtrl,
                controllerAs: 'pageCtrl'
            })
            .when('/IdentificationFin', {
                templateUrl: 'formulaire_multiple',//page commune avec gestion de compte
                controller: SEL.APP.IdentificationFinCtrl,
                controllerAs: 'pageCtrl'
            })
            .when('/echec_identification', {
                templateUrl: 'api/template/Souscription/identificationFailure.html',
                controller: SEL.APP.IdentificationFailureCtrl,
                controllerAs: 'pageCtrl'
            })
           .when('/Forfait', {
                templateUrl: 'api/template/Souscription/forfait.html',
                controller: SEL.APP.ForfaitCtrl,
                controllerAs: 'forfait'
            })
            .when('/Porteur', {
                templateUrl: 'api/template/Souscription/porteur.html',
                controller: SEL.APP.PorteurCtrl,
                controllerAs: 'porteur'
            })
            .when('/Photo', {
                templateUrl: 'api/template/Souscription/photo.html',
                controller: SEL.APP.PhotoCtrl,
                controllerAs: 'photo'
            })
            .when('/Paiement', {
                templateUrl: 'api/template/Souscription/paiement.html',
                controller: SEL.APP.PaiementCtrl,
                controllerAs: 'paiement'
            })
            .when('/Paiement2', {
                templateUrl: 'api/template/Souscription/paiement2.html',
                controller: SEL.APP.Paiement2Ctrl,
                controllerAs: 'paiement2'
            })
            .when('/Recapitulatif', {
                templateUrl: 'api/template/Souscription/recapitulatif.html',
                controller: SEL.APP.RecapitulatifCtrl,
                controllerAs: 'recapitulatif'
            })
            .when('/Signature', {
                templateUrl: 'api/template/Souscription/signature.html',
                controller: SEL.APP.SignatureCtrl,
                controllerAs: 'pageCtrl'
            })
            .when('/Signature2', {
                templateUrl: 'api/template/Souscription/signature2.html',
                controller: SEL.APP.Signature2Ctrl,
                controllerAs: 'pageCtrl'
            })
            .when('/Confirmation', {
                templateUrl: 'api/template/Souscription/confirmation.html',
                controller: SEL.APP.ConfirmationCtrl,
                controllerAs: 'api/template/Souscription/confirmation'
            })
            .when('/Confirmation2', {
                templateUrl: 'api/template/Souscription/confirmation2.html',
                controller: SEL.APP.Confirmation2Ctrl,
                controllerAs: 'confirmation2'
            })
            .otherwise({
                redirectTo: '/Profil'
            });

        $locationProvider
            .html5Mode(false);
    }]
);


SEL.appSel.filter("dateFormatStr",function() {
    return function(birthDate){
        if(!birthDate || !birthDate.day || !birthDate.month || !birthDate.year) {
            return "";
        }
        return birthDate.day + "/" + birthDate.month + "/" + birthDate.year;
    }
});

if (typeof CX == "undefined") {
    CX = {};
    CX.Model = function(){}
}

CX.Model.prototype.dateFormat = function() {
    return function(rawBirthDate) {

        if(!rawBirthDate) {

            return "";
        }

        return moment(rawBirthDate).format("DD/MM/YYYY");
    }
};




CX.MODEL = new CX.Model();
SEL.appSel.filter("dateFormat", [CX.MODEL.dateFormat]);

SEL.appSel.filter("euro", function() {
    return function(pstring, fraction, separateur, symbol, prefix) {
        if (!pstring) {

            return "";
        }
        pstring += "";
        prefix = prefix || false;
        separateur = separateur || ",";
        var tab = pstring.split('.');

        var unit = tab[0];
        var dec = "";
        for (var i =0; i<fraction*1;i++) {
        	dec += "0";
        }
        dec  = tab.length > 1 ? tab[1].substr(0, fraction) : dec;
        var sep  = dec.length > 0 ? separateur : "";
        var res  = unit + sep + dec;
        res = prefix ? symbol + res : res + symbol;

        return  res;
    }
});

SEL.appSel.service("$sender",   ['$http', SEL.Sender]);
SEL.appSel.service("$io",       ['$q', '$sender', '$rootScope', SEL.IO]);
/*********************************************************************************************************
 * using App
 *********************************************************************************************************/
SEL.appSel
.controller("formBuilderCtrl",           ['$scope', '$compile', '$element', '$http', '$sce', SEL.APP.formBuilderCtrl])
.controller("TestController",            ['$scope', '$compile', '$element', '$http', '$sce', '$route', '$location', '$filter', SEL.APP.TestController])
.controller("MainCtrl",                  ['$scope', '$route', '$routeParams', '$location', '$cookieStore', '$element', SEL.APP.MainCtrl])
.controller('ProfilCtrl',                ['$scope', '$io', '$location', '$http', '$sce', '$route', '$routeParams', '$compile', 'Upload', '$q', '$cookieStore', '$rootScope', 'Wording', SEL.APP.ProfilCtrl])
.controller('RattachementCtrl',          ['$scope', '$io', '$location', '$http', '$sce', '$route', '$routeParams', '$compile', 'Upload', '$q', '$cookieStore', '$rootScope', 'Wording', SEL.APP.RattachementCtrl])
.controller('IdentificationCtrl',        ['$scope', '$io', '$location', '$http', '$sce', '$route', '$routeParams', '$compile', 'Upload', '$q', '$cookieStore', '$rootScope', 'rattachementSearch', 'Wording', SEL.APP.IdentificationCtrl])
.controller('IdentificationSuiteCtrl',   ['$scope', '$io', '$location', '$http', '$sce', '$route', '$routeParams', '$compile', 'Upload', '$q', '$cookieStore', '$rootScope', 'rattachementSearch', '$filter', 'Wording', SEL.APP.IdentificationSuiteCtrl])
.controller('IdentificationFinCtrl',     ['$scope', '$io', '$location', '$http', '$sce', '$route', '$routeParams', '$compile', 'Upload', '$q', '$cookieStore', '$rootScope', 'Wording', SEL.APP.IdentificationFinCtrl])
.controller('IdentificationFailureCtrl', ['$scope', '$io', '$location', '$http', '$sce', '$route', '$routeParams', '$compile', 'Upload', '$q', '$cookieStore', '$rootScope', 'Wording', SEL.APP.IdentificationFailureCtrl])
.controller('ForfaitCtrl',               ['$scope', '$io', '$location', '$http', '$sce', '$route', '$routeParams', '$compile', 'Upload', '$q', '$cookieStore', '$rootScope', 'Wording', SEL.APP.ForfaitCtrl])
.controller('PorteurCtrl',               ['$scope', '$io', '$location',   '$sce', '$route', '$routeParams', '$compile', 'Upload', '$q', '$cookieStore', '$rootScope', '$filter', 'Wording', 'Normalization', SEL.APP.PorteurCtrl])
.controller('PhotoCtrl',                 ['$scope', '$io', '$location', '$http', '$sce', '$route', '$routeParams', '$compile', 'Upload', '$q', '$cookieStore', '$rootScope', 'Wording', SEL.APP.PhotoCtrl])
.controller('PaiementCtrl',              ['$scope', '$io', '$location', '$http', '$sce', '$route', '$routeParams', '$compile', 'Upload', '$q', '$cookieStore', '$rootScope', '$filter', 'Wording', 'Normalization', SEL.APP.PaiementCtrl])
.controller('Paiement2Ctrl',             ['$scope', '$io', '$location', '$http', '$sce', '$route', '$routeParams', '$compile', 'Upload', '$q', '$cookieStore', '$rootScope', 'normalisationFactory', '$filter', 'Wording', SEL.APP.Paiement2Ctrl])
.controller('RecapitulatifCtrl',         ['$scope', '$io', '$location', '$http', '$sce', '$route', '$routeParams', '$compile', 'Upload', '$q', '$cookieStore', '$rootScope', 'Wording', SEL.APP.RecapitulatifCtrl])
.controller('SignatureCtrl',             ['$scope', '$io', '$location', '$http', '$sce', '$route', '$routeParams', '$compile', 'Upload', '$q', '$cookieStore', '$rootScope', 'Wording', SEL.APP.SignatureCtrl])
.controller('Signature2Ctrl',            ['$scope', '$io', '$location', '$http', '$sce', '$route', '$routeParams', '$compile', 'Upload', '$q', '$cookieStore', '$rootScope', 'Wording', SEL.APP.Signature2Ctrl])
.controller('ConfirmationCtrl',          ['$scope', '$io', '$location', '$http', '$sce', '$route', '$routeParams', '$compile', 'Upload', '$q', '$cookieStore', '$rootScope', 'Wording', SEL.APP.ConfirmationCtrl])
.controller('Confirmation2Ctrl',         ['$scope', '$io', '$location', '$http', '$sce', '$route', '$routeParams', '$compile', 'Upload', '$q', '$cookieStore', '$rootScope', 'Wording', SEL.APP.Confirmation2Ctrl])
.controller('BreadcrumbCtrl',            ['$location', '$scope', '$compile', SEL.APP.BreadcrumbCtrl])
.controller('HistoryCtrl',               ['$location', '$scope', '$compile', SEL.APP.HistoryCtrl])
//.controller('CookieCtrl',                ['$location', '$scope', '$compile', '$cookieStore', SEL.APP.CookieCtrl])
