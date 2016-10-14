CX.Controllers.prototype.IdentificationFailureCtrl = function($scope, $location, $http, $sce, $route, $routeParams, $compile, Upload, $q, $filter, Wording) {
    var vm = this;

    var initCtrl = function() {
        $scope.errorMessages = Wording.getCategorie('cpt').cpt_erreur;
       // vm.error = Wording.getCategorie('cpt').cpt_erreur;
        //vm.error = $scope.errorMessages[CX.error];
        vm.error = Wording.get('cpt.cpt_erreur.' + CX.error);

        // Message d'erreur - aucun résultat :
        vm.errorMsg = $sce.trustAsHtml(Wording.get('cpt.cpt_erreur.CU-RAT-EC01-MSS_001'));
    };

    $scope.$on('$viewContentLoaded', function(event) {
        initCtrl();
    });


    // On bouton "Terminer" :
    vm.onTerminer = function (){
        $location.path("saisie_donnees_client")
    }
};
