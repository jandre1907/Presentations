/**
 * Step 0: Profil
 * *********************************************************************************
 */
SEL.App.prototype.ProfilCtrl = function ($scope, $io, $location, $http, $sce, $route, $routeParams, $compile, Upload, $q, $cookieStore, $rootScope, Wording) {

    var name = "ProfilCtrl";

    this.$route = $route;
    this.$location = $location;
    // this.$routeParams = $routeParams;

    $scope.error = null;

    SEL.previousStep = [];
    SEL.HOLDER.profil.hasBeenReached = true;

    $scope.disableSubmit = false;

    $scope.test = function() {
        SEL.APP.log(name);
    };

    var error = function catalogProductFormInnerError(data, status,
            headers, config, statusText) {
        $location.path("/Profil");
        $scope.error = "ERREUR, Veuillez réessayer plus tard.";
        response = false;
        return;
    };

    $scope.gotoStep = function() {
        SEL.APP.log("rootScope.broadcast(sendRequest)");
        $rootScope.$broadcast("sendRequest");
        $scope.formSubmitted = true;

        var nextStep = ("/Profil");

        SEL.HOLDER.profil.hasCard       = $scope.userInfo.hasCard;
        SEL.HOLDER.profil.isUser        = $scope.userInfo.isUser;
        SEL.HOLDER.porteur.data.hasCard = $scope.userInfo.hasCard;
        SEL.HOLDER.porteur.data.isUser  = $scope.userInfo.isUser;
        SEL.saveStep($scope);


        nextStep = SEL.MODEL.getNextStep($scope.userInfo.hasCard,  $scope.userInfo.isUser, $scope.userInfo.isConnected, $scope.userInfo.isSig);

        SEL.APP.log(nextStep);
        if ( nextStep == "/Profil" ) {
            $scope.error = Wording.get('sna.sna_profil.champs_requis_msg');
            $rootScope.$broadcast("receiveResponse");
            $location.path(nextStep);
        } else {
            $scope.error = "";

            SEL.htmlForms.forfaitButton = SEL.MODEL.createButton('/Forfait', Wording);
            SEL.HOLDER.profil.valid = true;


            SEL.MODEL.jumpStep(nextStep);
            $rootScope.$broadcast("receiveResponse");
            if(nextStep == "login") {
                window.location.hash ="";
                window.location = "login?identification=" +  $scope.userInfo.hasCard;
            }
            $location.path(nextStep);

        }
    };


    var initCtrl = function() {
        $scope.formSubmitted = false;

        $scope = SEL.loadStep($scope);

        if (SEL.HOLDER.porteur.data) {
            SEL.HOLDER.porteur.data = SEL.MODEL.overwriteObject(SEL.HOLDER.porteur.data, SEL.MODEL.userDefault());
        } else {
            SEL.HOLDER.porteur.data = SEL.MODEL.userDefault();
        }

        $scope.Holder = SEL.HOLDER.porteur.data;
        $scope.Holder.forfait = SEL.HOLDER.forfait;







        // $scope = SEL.MODEL.loadForm("/Profil", $scope, $cookieStore);
        $scope.userInfo.hasCard = (SEL.HOLDER.profil.hasCard == "1" ||  SEL.HOLDER.profil.hasCard == "0")   ? SEL.HOLDER.profil.hasCard   : null;
        $scope.userInfo.isUser =  (SEL.HOLDER.profil.isUser  == "1" ||  SEL.HOLDER.profil.isUser  == "0")   ? SEL.HOLDER.profil.isUser    : null;

        SEL.MODEL.log($scope.userInfo.hasCard);
        SEL.MODEL.log($scope.userInfo.isUser);

        SEL.previousStep = [];

        SEL.HOLDER.profil.hasBeenReached=true;

        nextCase("init");

        $rootScope.$broadcast("receiveResponseError");
    }



    var disableSubmit = function() {
        $scope.disableSubmit = true;
    };

    var enableSubmit = function() {
        $scope.disableSubmit = false;
    };

    var gotoNextStep = function(){
    	SEL.MODEL.profilStep = true;
        gotoStep("/Forfait");
    };

    var showNAActifMessage = function () {
        $scope.error = Wording.get('sna.sna_erreur.SNA-CO-EC01-ERR_003');
    };

    var checkFailureCase = function(userContext) {
        var res = true;

        switch (userContext.GET_CASE) {
            case "FP_NA_actif":
                disableSubmit();
                showNAActifMessage();
                res = false;
            break;
        }
        return res;
    };

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
                    "userSig":  $scope.userSig,
                    "payerSig": $scope.payerSig,
                    "userSel":  $scope.userSel,
                    "userInfo":  $scope.userInfo
                	},
                "step": "Profil"
            }
        );
        receive.then(
            function(data) {
                if (data.userContext) {
                	SEL.APP.log(data);
                	$scope.userInfo.isConnected = data.userContext.atomCase.CON;
                	SEL.HOLDER.profil.isUser    = $scope.userInfo.isConnected ? true : SEL.HOLDER.profil.isUser;
                	$scope.userInfo.hasCard     = data.userContext.atomCase.hasCard;
                	$scope.userInfo.isUserSel   = data.userContext.atomCase.SEL;
                	$scope.userInfo.isSig       = data.userContext.atomCase.SIG;
                	SEL.HOLDER.profil.hasCard   = $scope.userInfo.isSig ? true : SEL.HOLDER.profil.hasCard;

                    if (!checkFailureCase(data.userContext.atomCase)) {
                        return;
                    }
                }


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
                	//"options":SEL.HOLDER.forfait.option,
                	//"cartId":SEL.HOLDER.profil.cartId,
                	 //"sku": "navigo_annuel",
                     //"qty": "1",
                	},
                "step": "Profil"
            }
        );
        receive.then(
            function(data) {
            	if ( data.stepUpdate != true ) {
            		var msg = data.data.message;
            		expose.reject(msg);
            	} else {
            		if ( $scope.userSig.isNotPayer ) {
            			$scope.payerSig.reference  = data.reference;
            			$scope.payerSig.customerId = data.customerId;
            			$scope.payerSig.street3    = data.client.adresse.ligne3;
            			$scope.payerSig.street2    = data.client.adresse.ligne2 || "";
            			$scope.payerSig.rum        = data.rum;
            		} else {
            			$scope.userSig.rum        = data.rum;

            		}

            		SEL.MODEL.paiementStep = true;
            		expose.resolve(data);

            	}

            	/*
                setCartId(data);
                var context = data.userContext.atomCase;
                if (context.reference) {
                    $scope.userSel.reference = context.reference;
                    $scope.userSig.reference = context.reference;
                }
*/


            },
            function(msg){
                SEL.APP.log(msg);
                expose.reject(msg);
            }
        );

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

            case "forfait":
            	stepSubmit()
            	.then(gotoNextStep, error);
                break;
            default:
                defaultCase();
        }
    }



    $scope.$on('$viewContentLoaded', function(event) {
        SEL.MODEL.log("content loaded");
        initCtrl();

    });

    var error = function(msg){
        $scope.error = msg;// a changer $scope.errorMessages['SNA-CO-EC01-ERR_008'];
        SEL.APP.log(msg);
    }

}

/** ************MODEL********************* */
/**
 * Step 0: Profil
 * *********************************************************************************
 */
SEL.Model.prototype.getNextStep = function(hasCard, isUser, isConnected, isSig ) {
    this.log("setProfil" + hasCard + " " + isUser)
    if ( ! isConnected ) {
	    var nextStep = '/Erreur';

	    if (isUser=="1" && hasCard=="1") {
	        nextStep = 'login';
	    }
	    if (isUser=="1" && hasCard=="0") {
	        nextStep = 'login';
	    }
	    if (isUser=="0" && hasCard=="1") {
	        nextStep = '/Identification';
	    }
	    if (isUser=="0" && hasCard=="0") {
	        nextStep = '/Forfait';
	    }
	    if (isUser==null ||hasCard==null) {
	        nextStep = '/Profil';
	    }
    } else if (isConnected && isSig) {
    	   nextStep = '/Forfait';
    } else if (isConnected && !isSig){
        if (hasCard == "1") {
            nextStep = '/Identification';
        } else if(hasCard == "0") {
            nextStep = '/Forfait';
        }
    }

    return nextStep;
}

