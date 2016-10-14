CMC.Controllers.prototype.ConfirmationCtrl = function($scope,$window) {

    var vm = this;

    $scope.$on('$viewContentLoaded', function(event) {
        CMC.log(" - ConfirmationCtrl - ");
        initCtrl();
    });

    var initCtrl = function() {
        $scope.errorMessages = CMC.MSG;
        vm = CMC.MODEL.loadStep(vm);

        // (lv) info = l'adresse Email provient de l'objet userSel. (voir template).

        // calcul de la date estimé de la livraison =
        // date = date actuelle (commande) +  variable -> "jourDeValidation" + jours du week-end
        function addBusinessDays(date, daysToAdd) {
            var cnt = 0;
            var tmpDate = moment(date);
            while (cnt < daysToAdd) {
                tmpDate = tmpDate.add(1,'days');
                if (tmpDate.weekday() != moment().day("Sunday").weekday() && tmpDate.weekday() != moment().day("Saturday").weekday()) {
                    cnt = cnt + 1;
                }
            }
            return tmpDate;
        }

        var aujourdhui = moment();
        var dateLivraison =  addBusinessDays(aujourdhui,vm.jourDeValidation);
        var diffDays = dateLivraison.diff(aujourdhui, 'days');
        vm.jourDelai = diffDays;
    };


    // Bouton "Acceder espace-client"
    vm.onAccederEspace = function() {
        path = String($window.location).split("/carte")[0]+"/";
        // origin - path = String($window.location).split("/carte")[0]+"/espace-client";
        $window.location.href = path;
    }
};

