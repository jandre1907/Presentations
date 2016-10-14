SEL.App.prototype.ConfirmationCtrl = function ($scope, $io, $location, $http, $sce, $route, $routeParams, $compile, Upload, $q, $cookieStore, $rootScope, Wording) {


    var initCtrl = function () {
        SEL.APP.fall($location, { 
           	"profil" : "/Profil",
           	"forfait" : "/Forfait",
           	"porteur" : "/Porteur",
           	"photo" : "/Photo",
           	"paiement" : "/Paiement",
       	    "recapitulatif" : "/Recapitulatif",
       	    "signature" : "/Signature"
        });

   	    $scope.disableSubmit = true;
        $scope.errorMessages = Wording.getCategorie('sna').sna_erreur;

        $scope = SEL.loadStep($scope);

		SEL.HOLDER.forfait.hasBeenReached        = true;
		SEL.HOLDER.porteur.hasBeenReached        = true;
		SEL.HOLDER.photo.hasBeenReached          = true;
		SEL.HOLDER.paiement.hasBeenReached       = true;
		SEL.HOLDER.recapitulatif.hasBeenReached  = true;
		SEL.HOLDER.signature.hasBeenReached      = true;
		//SEL.HOLDER.confirmation.hasBeenReached   = true;

        //$scope.email ="gilles@pozniak.com";
        $scope.deliveryDate =
        $scope.cart.options[$scope.cart.optionsId.date_forfait].day + "/" +
        $scope.cart.options[$scope.cart.optionsId.date_forfait].month + "/" +
        $scope.cart.options[$scope.cart.optionsId.date_forfait].year;

        // " isNotPayer  iban url_photo  photo_ok
        $scope.blockNumber = [0,0,0,0]; // & 1 1 0

        SEL.APP.log($scope.blockNumber);


        if ( $scope.userSig.isNotPayer ) {
        	$scope.blockNumber[0] = "1";
        	if ( $scope.payerSig.iban ) {
        		$scope.blockNumber[1] = "1";
        	}
        } else {
        	if ( $scope.userSig.iban ) {
        		$scope.blockNumber[1] = "1";
        	}
        }
    	if ( $scope.cart.documents.url_photo ) {
    		$scope.blockNumber[2] = "1";
    	}

    	$scope.blockNumber = $scope.blockNumber.join("");
        $scope.error = null;

        SEL.APP.log($scope.blockNumber);

       nextCase("init");
       $rootScope.$broadcast("receiveResponse");

    }

    var disableSubmit = function() {
        $scope.disableSubmit = true;
    };

    var enableSubmit = function() {
        $scope.disableSubmit = false;
    };

    var gotoNextStep = function(){
    	SEL.MODEL.forfaitStep = true;
        gotoStep("../login");
    };

    var gotoStep = function (nextStep) {
        SEL.saveStep($scope);
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
                    "newUser":   $scope.userInfo.isNew || ""
                	},
                "step": "Confirmation"
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
            case "login":
            	gotoNextStep();
            	/*
            	stepSubmit()
            	.then(gotoNextStep, error);*/
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

        nextCase("login");

    }




    $scope.$on('$viewContentLoaded', function (event) {
        initCtrl();
    });


    var error = function(msg){
        $scope.error = $scope.errorMessages['SNA-CO-EC01-ERR_008'];
        SEL.APP.log(msg);
    }

}



