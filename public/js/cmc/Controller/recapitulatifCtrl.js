CMC.Controllers.prototype.RecapitulatifCtrl = function ($scope, $rootScope, $io, $location, $q, CrtOrUptCardOrderModel, $log, $http, Wording) {

    var vm = this;

    $scope.$on('$viewContentLoaded', function (event) {
        $log.log("recapitulatif loaded");
        initCtrl();
    });

    var initCtrl = function () {
        vm.errorMessages = Wording.getCategorie("cdc").cdc_erreur;
        // Affecte la valeur de "cardOrderId" a l'objet Global CMC.objets
        // pour passer cette valeur au  transformer de la methode "processOrder" :
        CMC.objects.userInfo.cardOrderId = CrtOrUptCardOrderModel.cardOrderId;
        CMC.MODEL.loadStep(vm);
    };

    // Go to Step :
    function gotoStep(nextStep) {
        CMC.MODEL.saveStep(vm);
        $location.path(nextStep);
    }


    // SAISIR ORANGE - API commande de carte SIG :
    var saisirOrange = function () {
        var expose = $q.defer();
        var receive = $io.execute("saisirOrange", vm, CMC.Transformers.processSaisirOrange);
        receive.then(
            function (data) {

                // Sauvegarde la valeur "referenceContratCommercial"
                // qui correspond au parametre "refContratSig" de la methode "processOrder".
                vm.userInfo.refContratSig = data.resultatSaisieContratCommercialEtDroits.referenceContratCommercial;

                $log.log("saisirOrange promise OK ");
                expose.resolve(data);
            },
            function (err) {
                $log.log("saisirOrange promise FAIL ", err);
                expose.reject("saisirOrange promise FAIL " + err);
            }
        );
        return expose.promise;
    };


    // - PROCESSORDER - API commande de carte MAGENTO
    var processOrder = function () {

        var expose = $q.defer();
        var receive = $io.execute("processOrder", vm, CMC.Transformers.processOrder, CMC.Parsers.processOrder);
        receive.then(
            function (data) {
                $log.log("processOrder promise OK ");
                vm.userInfo.increment_id = data.increment_id;
                expose.resolve(data);
            },
            function (err) {
                $log.log("processOrder promise FAIL ", err);
                expose.reject("processOrder promise FAIL " + err);
            }
        );
        return expose.promise;
    };

    // - VALIDATEORDER - API validation commande de carte MAGENTO :
    var validateOrder = function () {

        var expose = $q.defer();
        $http({
            method: CMC.routes.validateOrder.method,
            url:    CMC.routes.validateOrder.url,
            params: {orderId:vm.userInfo.increment_id}
        })
            .then(function(){
                $log.log("validateOrder promise OK ");
                expose.resolve();
            },function(err){
                $log.log("validateOrder promise FAIL ", err);
                expose.reject("processOrder promise FAIL " + err);
            });

        return expose.promise;
    };

    //-------------------
    // CLICK BT "JE CERTIFIE QUE CES DONNÉES SONT EXACTES " :
    vm.onCertifie = function () {
        // reset message erreur
        vm.error = "";

        saisirOrange()
            .then(processOrder, promiseErrorHandler)
            .then(validateOrder, promiseErrorHandler)
            .then(function(){
                $log.log("*********************");
                $log.log("All promise send OK ");
                $log.log("*********************");
                // Event Spinner :
                $rootScope.$broadcast("receiveResponse");

                gotoStep("/Confirmation");
            }, // FAIL
            function(err){
                $log.log("*********************");
                $log.log("a promise FAILED ", err);
                $log.log("*********************");
                // Event Spinner :
                $rootScope.$broadcast("receiveResponseError");

                vm.error = vm.errorMessages['CU-RAT-EC01-MSS_002'];
            });
    };

    function promiseErrorHandler (err){
        $log.log("*********************");
        $log.log("  promiseErrorHandler FAIL : " + err);
        $log.log("*********************");

        // Event Spinner :
        $rootScope.$broadcast("receiveResponseError");

        vm.error = vm.errorMessages['CU-RAT-EC01-MSS_002'];
    }
};
