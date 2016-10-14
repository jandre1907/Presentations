CX.Controllers.prototype.MainCtrl = function($scope, $location, $http, $sce, $route, $routeParams, $compile, Upload, $q) {
    CX.$http = $http;
    $route.reload();
    $scope.showFirstPage = $location.path() == "/saisie_donnees_client";

};

CX.Controllers.prototype.TitleCtrl = function($scope, $location, $http, $sce, $route, $routeParams, $compile, Upload, $q, Wording) {
    $scope.$on('$locationChangeSuccess', function(event) {
        CX.log('TitleCtrl viewContentLoaded');

        var mapper_title = {
            "saisie_donnees_client": Wording.get('cpt.cpt_inscription.titre_etape'),
            "donnees_complementaires": "Création de mon espace personnel",
            "confirmation_creation_espace": "Création de mon espace personnel",
            "echec_identification": "Création de mon espace personnel",//script
            "demande_interdite": "Création de mon espace personnel",//script
            "Verification": "Mes informations personnelles",
            "lien_activation_expire": "Problème d'activation de votre espace personnel",
            "selection_identite": "Création de mon espace personnel",

            "end": ""
            //
        };

        var mapper_breadcrumb = {
            // "saisie_donnees_client": Wording.get('cpt.cpt_inscription.titre_etape'),
            "donnees_complementaires": "Besoin d’infos complémentaires",
            //"selection_identite": "Création de mon espace",
            //"echec_identification": "Création de mon espace",//script
            // "demande_interdite": "Création de mon espace",//script
            "Verification": "Mes informations personnelles",
            // "lien_activation_expire": "Problème d'activation de votre espace",

            "end": ""
            //
        };
        var key = $location.path().substr(1);
        $scope.title = mapper_title[key];
        if(!mapper_breadcrumb[key]) {
            $scope.breadcrumb = false;
            return;
        }
        $scope.breadcrumb = mapper_breadcrumb[key]

    });
};
