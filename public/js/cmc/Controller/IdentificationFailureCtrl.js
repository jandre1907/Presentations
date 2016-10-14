CMC.Controllers.prototype.IdentificationFailureCtrl = function($scope,$sce,$location, Wording) {
    var vm = this;

    $scope.$on('$viewContentLoaded', function(event) {
        initCtrl();
    });

    var initCtrl = function() {
        $scope.errorMessages = Wording.getCategorie("cdc").cdc_erreur;
        // Message d'erreur :
        vm.errorMsg = $sce.trustAsHtml($scope.errorMessages[Rattachement.errorMessageKey]);
    };

    // On bouton "Terminer" :
    vm.onTerminer = function (){
        $location.path("/")
    }
};

