SEL.App.prototype.RecapitulatifCtrl = function ($scope, $io, $location, $http, $sce, $route, $routeParams, $compile, Upload, $q, $cookieStore, $rootScope, Wording) {


    var initCtrl = function () {
        SEL.APP.fall($location, { 
           	"profil" : "/Profil",
           	"forfait" : "/Forfait",
           	"porteur" : "/Porteur" //,
           	//"photo" : "/Photo",
       	    //"paiement" : "/Paiement"
        });     
   	    $scope.disableSubmit = true;
        $scope.errorMessages = Wording.getCategorie('sna').sna_erreur;

        $scope = SEL.loadStep($scope);


		SEL.HOLDER.forfait.hasBeenReached        = true;
		SEL.HOLDER.porteur.hasBeenReached        = true;
		SEL.HOLDER.photo.hasBeenReached          = true;
		SEL.HOLDER.paiement.hasBeenReached       = true;
		SEL.HOLDER.recapitulatif.hasBeenReached  = true;
		SEL.HOLDER.signature.hasBeenReached      = false;
		//SEL.HOLDER.confirmation.hasBeenReached   = false;

        $scope.error = null;
        $scope.Payer = $scope.payerSig;
        $scope.Holder = SEL.HOLDER.porteur.data;

        $scope.Holder.forfait = SEL.HOLDER.forfait;
        $scope.Holder.rum = $scope.userSig.rum;



        // Verif si toutes les données utilisateur sont OK :
        // et affiche le message en fonction.
        // Flag message qui indique qu'il manque des données utilisateur.
        $scope.isSouscriptionDataComplete = false;

        if (
        		SEL.MODEL.paiementStep &&
        		SEL.MODEL.photoStep  &&
        		// SEL.MODEL.porteurStep && // n'existe plus a voir avec julien
        		SEL.MODEL.forfaitStep
        		) {
            $scope.isSouscriptionDataComplete = true;
        }

       nextCase("init");
       $rootScope.$broadcast("receiveResponse");

    }


    /*

    var showDEDIMessage = function() {
        $scope.error = $scope.errorMessages["SNA-CO-EC01-ERR_008"];
    };
*/
    var disableSubmit = function() {
        $scope.disableSubmit = true;
    };

    var enableSubmit = function() {
        $scope.disableSubmit = false;
    };

    var completeStep = function(){
        SEL.MODEL.Holder.recapitulatif.valid = true;
    }

    var gotoNextStep = function(){
        completeStep();
    	SEL.MODEL.forfaitStep = true;
    	if ( $scope.cart.documents.url_photo && ( $scope.userSig.iban  || $scope.payerSig.iban )) {
    		gotoStep("/Signature");
    	} else {
    		gotoStep("/Confirmation");
    	}


    };

    var gotoStep = function (nextStep) {
        SEL.saveStep($scope);
        //if(nextStep == "/Photo"){
        //    updateStep();
        //}
        $rootScope.$broadcast("receiveResponse");
        $location.path(nextStep);
    }

    var stepLoad = function() {
        var expose = $q.defer();
        var receive = $io.execute(
            "stepLoad",
            {
                "params": {
                	"reference": $scope.userSel.reference || "",
                    "email":     $scope.userSel.email || "",
                    "hasCard":   $scope.userInfo.hasCard || "",
                    "newUser":   $scope.userInfo.isNew || "",
                    "userSig":   $scope.userSig || "",
                    "payerSig":  $scope.payerSig || "",
                    "userSel":   $scope.userSel || "",
                    "userInfo":  $scope.userInfo || ""
                	},
                "step": "Paiement"
            }
        );
        receive.then(
            function(data) {
                expose.resolve(data);
            },
            function(msg){
                SEL.APP.log(msg);
                expose.reject(msg);
            }
        );

        return expose.promise;
    }


    var stepSubmit = function() {
    var expose = $q.defer();
        var receive = $io.execute(
            "stepSubmit",
            {
                "params": {
                	"cart":     $scope.cart,
                	"userSig":  $scope.userSig,
                	"payerSig": $scope.payerSig,
                	"userSel":  $scope.userSel,
                	"userInfo":  $scope.userInfo
                	},
                "step": "Recapitulatif"
            }
        );
        receive.then(
            function(data) {
            	if ( data.stepUpdate != true ) {
            		var msg = data.data.message;
            		expose.reject(msg);
            	} else {

            		//SEL.MODEL.paiementStep = true;
            		$scope.cart.orderId = data.orderId;
            		expose.resolve();

            	}
            },
            function(msg){
                SEL.APP.log(msg);
                expose.reject(msg);
            }
        );

        return expose.promise;
    }


    var updateObjects = function(data) {
		var expose = $q.defer();
		expose.resolve(data)
		return expose.promise;
    }

    var getCase = function() {
        if($scope.orderCase) {
            return $scope.orderCase;
        }
        var guessCase = "default";
        return guessCase;
    }

    var defaultCase = function() {
        SEL.APP.log("execute defaultCase");
        enableSubmit();
    }

    var nextCase = function(orderCase) {
        $scope.orderCase = $scope.orderCase || orderCase || false;
        var useCase = getCase();
        $scope.orderCase = false;
        switch(useCase) {
            case "init":
                SEL.APP.log("init");
                stepLoad();
                break;
            case "recapitulatif":
            	stepSubmit()
            	.then(gotoNextStep, error);
                break;
            default:
                defaultCase();
        }
    }


    $scope.submitForm = function() {
    	$rootScope.$broadcast("sendRequest");
        $scope.formSubmitted = true;
        //setIban();
        if($scope.step_form.$invalid) {
            return;
        }

        nextCase("recapitulatif");

    }


    $scope.$on('$locationChangeStart', function(event) {
        SEL.saveStep($scope);
     });


    $scope.$on('$viewContentLoaded', function (event) {
        initCtrl();
    });


    var error = function(msg){
        $scope.error = $scope.errorMessages['SNA-CO-EC01-ERR_008'];
        SEL.APP.log(msg);
    }

}



