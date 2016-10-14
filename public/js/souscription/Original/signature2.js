SEL.App.prototype.Signature2Ctrl = function($scope, $io, $location, $http, $sce, $route,$routeParams, $compile, Upload, $q, $cookieStore, $rootScope, Wording) {


    hasPdf = false;
    this.meskey = "SNA-SIG-EC01-MSS_006";

    var guessCase = function($scope) {
        if(SEL.HOLDER.porteur.data.isNotPayer) {
            $scope.isNotPayer = SEL.HOLDER.porteur.data.isNotPayer;
        } else {
            $scope.mail = SEL.HOLDER.porteur.data.eMail;
            $scope.phone = SEL.HOLDER.porteur.data.telephoneMobile;
        }

        return $scope;
    }

    var initScopeHolder = function() {
        // SEL.HOLDER.porteur.data = SEL.MODEL.overwriteObject(SEL.MODEL.getDataFromCookie($cookieStore), SEL.MODEL.userDefault());
        if (SEL.HOLDER.porteur.data) {
          SEL.HOLDER.porteur.data = SEL.MODEL.overwriteObject(SEL.HOLDER.porteur.data, SEL.MODEL.userDefault());
        } else {
          SEL.HOLDER.porteur.data =  SEL.MODEL.userDefault();
        }

        SEL.HOLDER.porteur.data.otpOk = false;
        $scope.isNotPayer = SEL.HOLDER.porteur.data.isNotPayer;
        $scope.errorMessages = Wording.getCategorie('sna').sna_erreur;
        $scope.Holder = SEL.HOLDER.porteur.data;
        $scope = guessCase($scope);

		SEL.HOLDER.forfait.hasBeenReached        = true;
		SEL.HOLDER.porteur.hasBeenReached        = true;
		SEL.HOLDER.photo.hasBeenReached          = true;
		SEL.HOLDER.paiement.hasBeenReached       = true;
		SEL.HOLDER.recapitulatif.hasBeenReached  = true;
		SEL.HOLDER.signature.hasBeenReached      = true;
		//SEL.HOLDER.confirmation.hasBeenReached   = false;
    };

    var initCtrl = function () {
        //SEL.APP.fall($location, {"profil" : "/Profil"});

   	    $scope.disableSubmit = true;
   	    $scope.cgvAccepted = false;
   	    $scope.attempNumber = 3;
   	    $scope.otpSendedTwice = false;
   	    
        $scope.errorMessages = Wording.getCategorie('sna').sna_erreur;

        $scope = SEL.loadStep($scope);

        SEL.HOLDER.signature.hasBeenReached=true;


        initScopeHolder();
        $scope.userSig.contractId = SEL.contractId || null;
        nextCase("init");
        $rootScope.$broadcast("receiveResponse");

    };

	var getCase = function() {
		if ($scope.orderCase) {
			return $scope.orderCase;
		}
		var guessCase = "default";
		return guessCase;
	}

	var defaultCase = function() {
		SEL.APP.log("execute defaultCase");
		enableSubmit();
	}

	var disableSubmit = function() {
		$scope.disableSubmit = true;
	};

	var enableSubmit = function() {
		$scope.disableSubmit = false;
	};

    $scope.submitForm = function() {
    	$rootScope.$broadcast("sendRequest");
        $scope.formSubmitted = true;
        $scope.cart.documents.otp = $scope.otp;
        if($scope.step_form.$invalid) {
            return;
        }

        nextCase("confirmation");

    }

	var gotoNextStep = function() {
		SEL.MODEL.forfaitStep = true;
		gotoStep("/Confirmation2");
	};

    var gotoStep = function (nextStep) {
        SEL.saveStep($scope);
        $rootScope.$broadcast("receiveResponse");
        $location.path(nextStep);
    }


	var nextCase = function(orderCase) {
		$scope.error = null;
		$scope.orderCase = $scope.orderCase || orderCase || false;
		var useCase = getCase();
		$scope.orderCase = false;
		switch (useCase) {
		case "init":
			SEL.APP.log("init");
			stepLoad();
			break;

		case "confirmation":
			stepSubmit().then(gotoNextStep, error);
			break;
		default:
			defaultCase();
		}
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
                	"cart":     $scope.cart,
                	"userSig":  $scope.userSig,
                	"payerSig": $scope.payerSig,
                	"userSel":  $scope.userSel
                	},
                "step": "Signature2"
            }
        );
        receive.then(
            function(data) {
                hasPdf = true;
                $scope.pdfUrl     = SEL.prefix_pdf + data.url_pdf;
                $scope.sepaPdfUrl = SEL.prefix_pdf + data.sepa.url_pdf;

                $scope.imgUrl     = $scope.pdfUrl.substr(0, $scope.pdfUrl.length-4)     + ".png";
                $scope.sepaImgUrl = $scope.sepaPdfUrl.substr(0, $scope.sepaPdfUrl.length-4) + ".png";
                SEL.APP.log($scope.imgUrl);
                SEL.APP.log($scope.pdfUrl);
                SEL.HOLDER.porteur.data.pdfUrl = $scope.pdfUrl;

                $scope.cart.documents.url_pdf = $scope.pdfUrl;
                $scope.cart.documents.url_png = $scope.imgUrl;
                $scope.cart.documents.sepa = {};
                $scope.cart.documents.sepa.url_pdf = $scope.sepaPdfUrl;
                $scope.cart.documents.sepa.url_png = $scope.sepaImgUrl;
                $scope.cart.documents.token   = data.token;


    			$scope.deliveryDate =
    		        $scope.cart.options[$scope.cart.optionsId.date_forfait].day + "/" +
    		        $scope.cart.options[$scope.cart.optionsId.date_forfait].month + "/" +
    		        $scope.cart.options[$scope.cart.optionsId.date_forfait].year;





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
                "step": "Signature2"
            }
        );
        receive.then(
            function(data) {
            	if ( data.stepUpdate != true ) {
            		var msg = data.data.message;
            		$scope.otp = null;
            		$scope.attempNumber = data.attemptNumber;
                    if ( $scope.attempNumber<=0 && !$scope.otpSendedTwice ) {
                    	msg = $scope.errorMessages['SNA-SIG-EC01-ERR_005'];
                    }            		
            		expose.reject(msg);
            	} else {

            		//SEL.MODEL.paiementStep = true;
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



    $scope.$on('$viewContentLoaded', function (event) {
        initCtrl();
    });

    $scope.$on('$locationChangeStart', function(event) {
        SEL.saveStep($scope);
     });

    var enableValidateButton = function () {
        if(SEL.HOLDER.porteur.data.signatureCGV && SEL.HOLDER.porteur.data.otpOk) {
            $scope.validateButton = true;
        } else {
            $scope.validateButton = false;
        }
    }



    /**
     * set master signatureCGV = true | false
     *
     */
    $scope.acceptCGV = function() {
        $scope.cgvAccepted = !$scope.cgvAccepted;
    };

    var error = function(msg){
        $scope.error = msg || $scope.errorMessages['SNA-CO-EC01-ERR_008'];
        SEL.APP.log(msg);
    }

    $scope.getSmsOtp = function() {
        var success = function (data) {
            $scope.currentEmail = $scope.payerSig.email;
            $scope.otpSended = true;
            $scope.cart.otpMethod = "sms";
        };

        var error = function (data) {
            $scope.error = "erreur à l'envoi du code";
        };
        SEL.MODEL.getPayerSmsOtp($scope.cart.documents.token, success, error);
    };

    $scope.getPayerEmailOtp = function() {
        var success = function (data) {
            $scope.otpSended = true;
            $scope.otpSendedTwice = true;
            $scope.attempNumber = 3;
            $scope.cart.otpMethod = "email";
        };

        var error = function (data) {
            $scope.error = "erreur à l'envoi du code";
        };
        SEL.MODEL.getPayerEmailOtp($scope.cart.documents.token, success, error);
    };



}



/** Step 7: Signature **********************************************************************************/

SEL.Model.prototype.getPayerSmsOtp = function (token, success, error) {
    //"getPayerSmsOtp":          "api/contralia/otp/sms.json",
    SEL.MODEL.httpGet(SEL.routes.getPayerSmsOtp, {"token": token}, success, error);
}

SEL.Model.prototype.getPayerEmailOtp = function (token, success, error) {
    //"getPayerEmailOtp":          "api/contralia/otp/sms.json",
    SEL.MODEL.httpGet(SEL.routes.getPayerEmailOtp, {"token": token}, success, error);
}


