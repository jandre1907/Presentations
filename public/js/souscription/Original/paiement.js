SEL.App.prototype.PaiementCtrl = function ($scope, $io, $location, $http, $sce, $route,$routeParams, $compile, Upload, $q, $cookies, $cookieStore, $rootScope, $filter, Wording, Normalization) {

    $scope.year;
    $scope.month;
    $scope.day;
    $scope.cities = [];
    //var second = false;
    second = false;
    $scope.secondNormalize = false;

    $rootScope.$on(
        "sendRequest",
        function() {
            $scope.error = "";
        }
    );

    var initCtrl = function() {
        SEL.APP.fall($location, { 
           	"profil" : "/Profil",
           	"forfait" : "/Forfait",
           	"porteur" : "/Porteur"//,
       	   // "photo" : "/Photo"
        });     	
        $scope = SEL.fillBirthDate($scope);
        $scope.disableSubmit = true;
        $scope.errorMessages = Wording.getCategorie('sna').sna_erreur;

        $scope = SEL.loadStep($scope);

        SEL.APP.log($scope.payerSig.postalCode);

        SEL.MODEL.paymentStep = SEL.MODEL.paymentStep || false;
        SEL.MODEL.paiementStep = SEL.MODEL.paiementStep || false;
        if ( $scope.userSig.isNotPayer ) {
            $scope.cities.push($scope.payerSig.city);
        }

        SEL.HOLDER.forfait.hasBeenReached        = true;
        SEL.HOLDER.porteur.hasBeenReached        = true;
        SEL.HOLDER.photo.hasBeenReached          = true;
        SEL.HOLDER.paiement.hasBeenReached       = true;
        SEL.HOLDER.recapitulatif.hasBeenReached  = false;
        SEL.HOLDER.signature.hasBeenReached      = false;
        //SEL.HOLDER.confirmation.hasBeenReached   = false;

        nextCase("init");
        $rootScope.$broadcast("receiveResponse");

        $scope.$watchGroup(
            [
                'rawMobile',
                'rawFixe',
                'userSig.isNotPayer'
            ],
            function() {
                $scope.rawMobile = $filter('phoneFilter')($scope.rawMobile);
                $scope.payerSig.mobile = $filter('phoneUnfilter')($scope.rawMobile);
                $scope.rawFixe = $filter('phoneFilter')($scope.rawFixe);
                $scope.payerSig.phone = $filter('phoneUnfilter')($scope.rawFixe);
                $scope.step_form.mobile.$setValidity('phonePrefix',$scope.payerSig.mobile.length == 10 && ($scope.payerSig.mobile.substr(0,2) == '07' || $scope.payerSig.mobile.substr(0,2) == '06'));
                $scope.step_form.mobile.$setValidity('phonePrefix',$scope.step_form.mobile.$valid || !$scope.userSig.isNotPayer);
                $scope.step_form.telephoneFixe.$setValidity('phonePrefix',($scope.payerSig.phone.length == 10 && $scope.payerSig.phone.substr(0,2) != '07' && $scope.payerSig.phone.substr(0,2) != '06' && $scope.payerSig.phone.substr(0,1) == '0'));
                $scope.step_form.telephoneFixe.$setValidity('phonePrefix',$scope.step_form.telephoneFixe.$valid || $scope.payerSig.phone == "" || !$scope.userSig.isNotPayer);
            }
        );

        $scope.$watchGroup(
            [
                'payerSig.mobile',
                'payerSig.phone'
            ],
            function() {
                $scope.rawMobile = $filter('phoneFilter')($scope.payerSig.mobile);
                $scope.rawFixe = $filter('phoneFilter')($scope.payerSig.phone);
            }
        );
    };

    var disableSubmit = function() {
        $scope.disableSubmit = true;
    };

    var enableSubmit = function() {
        $scope.disableSubmit = false;
    };

    var completeStep = function() {
        SEL.MODEL.Holder.paiement.valid = true;
    };

    var gotoNextStep = function() {
        SEL.MODEL.forfaitStep = true;
        completeStep();
        gotoStep("/Recapitulatif");
    };

    var stepLoad = function() {
        var expose = $q.defer();
        $rootScope.$broadcast("sendRequest");
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
                $rootScope.$broadcast("receiveResponse");
                expose.resolve(data);
            },
            function(msg){
                $rootScope.$broadcast("receiveResponse");
                SEL.APP.log(msg);
                expose.reject(msg);
            }
        );

        return expose.promise;
    };


    var stepSubmit = function() {
        var expose = $q.defer();
        $rootScope.$broadcast("sendRequest");
        var receive = $io.execute(
            "stepSubmit",
            {
                "params": {
                	"cart":     $scope.cart,
                	"userSig":  $scope.userSig,
                	"payerSig": $scope.payerSig,
                	"userSel":  $scope.userSel,
                	"userInfo": $scope.userInfo
                	//"options":SEL.HOLDER.forfait.option,
                	//"cartId":SEL.HOLDER.profil.cartId,
                	 //"sku": "navigo_annuel",
                     //"qty": "1",
                },
                "step": "Paiement"
            }
        );
        receive.then(
            function(data) {
                $rootScope.$broadcast("receiveResponse");
                if (data.stepUpdate != true) {
                    var msg = data.data.message;
                    if (!data.IbanIsValid) {
                        $scope.error = $scope.errorMessages['SNA-PAI-EC01-ERR_004']
                    }
                    expose.reject(msg);
                    return;
                } else {
                    if ($scope.userSig.isNotPayer) {
                        $scope.payerSig.reference  = data.reference;
                        $scope.payerSig.customerId = data.customerId;
                        $scope.payerSig.street3    = data.client.adresse.ligne3;
                        $scope.payerSig.street2    = data.client.adresse.ligne2 || "";
                        $scope.payerSig.rum        = data.rum;
                        SEL.MODEL.porteurStep = true;
                        expose.resolve(data);
                        return;
                    } else {
                        $scope.userSig.rum = data.rum;
                        expose.resolve(data);
                        return;
                    }
                }
            },
            function(msg){
                $rootScope.$broadcast("receiveResponse");
                SEL.APP.log(msg);
                expose.reject(msg);
                return;
            }
        );

        return expose.promise;
    };

    var getCase = function() {
        if($scope.orderCase) {
            return $scope.orderCase;
        }
        var guessCase = "default";
        return guessCase;
    };

    var defaultCase = function() {
        SEL.APP.log("execute defaultCase");
        enableSubmit();
    };

    var nextCase = function(orderCase) {
        $scope.orderCase = $scope.orderCase || orderCase || false;
        var useCase = getCase();
        $scope.orderCase = false;
        switch(useCase) {
            case "init":
                SEL.APP.log("init");
                stepLoad();
                break;
            case "paiement":
                if ($scope.userSig.isNotPayer) {
                    doNormalization().then(
                        function () {
                            stepSubmit()
                                .then(
                                gotoNextStep,
                                error
                            )
                        }
                    );
                } else {
                    stepSubmit()
                        .then(
                        gotoNextStep,
                        error
                    )
                }
                break;
            default:
                defaultCase();
        }
    };

    $scope.$on('$viewContentLoaded', function(event) {
      SEL.MODEL.log("content loaded");
      initCtrl();
    });

    $scope.$on('$locationChangeStart', function(event) {
        SEL.saveStep($scope);
     });

    $scope.getCities = function() {
        if ($scope.userSig.isNotPayer) {
            SEL.APP.log("getCities");
            if($scope.payerSig && $scope.payerSig.postalCode) {

               if ($scope.payerSig.postalCode.length < 5) {
                   return;
                } else {
                    reqCities();
                }

            }
        }
    };

    var error = function(msg){
        $scope.error = msg || $scope.errorMessages['SNA-CO-EC01-ERR_008'];
        SEL.APP.log(msg);
    };

    var reqCities = function() {
        var expose = $q.defer();
        $rootScope.$broadcast("sendRequest");
        var receive = $io.execute("getCities", $scope.payerSig.postalCode.substr(0,5), SEL.Transformers.getCities, SEL.Parsers.getCities);
        receive.then(
            function success(cities) {
                $rootScope.$broadcast("receiveResponse");
                $scope.cities  = cities;
                $scope.payerSig.city = $scope.cities[0];
                expose.resolve(cities);
            },
            function error(msg) {
                $rootScope.$broadcast("receiveResponse");
                SEL.APP.log(msg);
                expose.reject(msg);
            }
        );

        return expose.promise;
    };

    var gotoStep = function (nextStep) {
        SEL.saveStep($scope);
        //if(nextStep == "/Photo"){
        //    updateStep();
        //}
        $rootScope.$broadcast("receiveResponse");
        $location.path(nextStep);
    };

    var setIban = function() {
        $scope.userSig.iban = "";
        for (var key in $scope.userSig.ibanTab) {
            $scope.userSig.iban += "" + $scope.userSig.ibanTab[key];
        }
        $scope.payerSig.iban = "";
        for (var key in $scope.payerSig.ibanTab) {
            $scope.payerSig.iban += "" + $scope.payerSig.ibanTab[key];
        }
    };

    $scope.submitForm = function() {
        $scope.formSubmitted = true;
        setIban();
        if($scope.step_form.$invalid) {
            return;
        }

        nextCase("paiement");

    };

    $scope.$watchGroup(
        [
            "payerSig.email",
            "payerSig.emailTwin",
            "userSig.birthDate.day",
            "userSig.birthDate.month",
            "userSig.birthDate.year"
        ],
        formIsValid
    );

    function formIsValid() {
        if ($scope.userSig.isNotPayer) {
            var emailOk = $scope.payerSig.email == $scope.payerSig.emailTwin; // && scope.step_form.eMail.$valid;

            var dateOk = true;
            var checkDate = dateValid($scope.payerSig.day, $scope.payerSig.birthDate.month, $scope.payerSig.birthDate.year);
            if (checkDate.ndDayPerMonthIsValid == "false"
                || checkDate.ageIsValid == "false"
                || checkDate.typeIsValid == "false"
                || checkDate.fevrier == "false"
            ) {
                $scope.error = $scope.errorMessages["SNA-RAT-EC02-ERR_002"];//"Erreur dans la saisie de la date de naissance. Merci de la saisir à nouveau."; //  SNA-RAT-EC02-ERR_002 SNA-RAT-EC02-ERR_007
                SEL.MODEL.log($scope.error);
                dateOk = false;
            }
            if (checkDate.toYoung == "true") {
                scope.error = $scope.errorMessages["SNA-CO-EC01-ERR_006"];// "L'abonnement est accessible à l'âge de 4 ans minimum"; // SNA-RAT-EC02-ERR_001 SNA-RAT-EC02-ERR_006
                SEL.MODEL.log($scope.error);
                dateOk = false;
            }
            if (!emailOk){
                $scope.error = "Email incorrect";//SEL.HOLDER.porteur.info.fr.soucriptionAlreadyExist;
                $scope.hasFormError = true;
                dateOk = false;
            }
            if(!emailOk || !dateOk) {
                disableSubmit();
            } else {
                enableSubmit();
            }
        } else {
            enableSubmit();
        }
    }

    var dateValid = function(clientDay,clientMonth,clientYear) {
        var date       = new Date();
        var dateMonth  = date.getMonth();
        var dateYear   = date.getFullYear();
        var dateDay    = date.getDay();
        var age        = dateYear - clientYear;
        var bissextile = false;
        var dateInfos  = { typeIsValid : "true", fevrier : "true" , ageIsValid : "true", toYoung : "false", ndDayPerMonthIsValid:"true"};

        var compiledDate = new Date(clientYear + "-" + clientMonth + "-" + clientDay);
        var cdateYear   = compiledDate.getFullYear();
        var cdateMonth  = (compiledDate.getMonth() + 1) % 12 ;
        cdateMonth == 0 ? cdateMonth = 12 : cdateMonth; // ajout gilles 05 09 2015
        var cdateDay    = compiledDate.getDate();

        if (cdateDay == clientDay && cdateMonth == clientMonth &&  cdateYear == clientYear) {
            typeIsValid = true;
            //**************controle type donnéess utilisateur*********
            if (typeof clientDay != "undefined" && clientMonth < 13 && clientMonth > 0) {
                //******** gestion d'années bissextile pour fevrier*******
                if (clientMonth == 02 && clientDay > 28 ) {
                    if (clientYear % 4   !== 0 ||
                        clientYear % 100 !== 0 ||
                        clientYear % 400 !== 0) {
                        dateInfos.fevrier = "false";
                    }
                }
                if (dateInfos.fevrier == "true") {
                    //********nombre de mois && nombre d'années***************
                    ndDayForMonth = (new Date(Date.parse(((clientMonth % 12) + 1).toString() + "/01/" + clientYear) - 86400000)).getDate();
                    if (clientDay > ndDayForMonth) {
                        dateInfos.ndDayPerMonthIsValid = "false";
                    }
                    //************controle de l'age****************************
                    if (age > 200) {
                        dateInfos.ageIsValid = "false";
                    }
                    else if (age < 4){
                        dateInfos.toYoung = "true";
                    }
                }
            }
        }
        else {
            dateInfos.typeIsValid = "false";
        }

        return dateInfos;
    //type chiffre uniquement Day:int x 2,month:int x 2, year: int x 4
    //controle 28,29,30,31 et année bisextile
    //pas plus de 200ans
    };

    function doNormalization() {
        var expose = $q.defer();

        var addressDataMapper = {
            line3: function(line3) {
                if (typeof line3 != 'undefined') {
                    $scope.payerSig.street3 = line3;
                }
                return $scope.payerSig.street3;
            },
            line2: function(line2) {
                if (typeof line2 != 'undefined') {
                    $scope.payerSig.street2 = line2;
                }
                return $scope.payerSig.street2;
            },
            line1: function(line1) {
                if (typeof line1 != 'undefined') {
                    $scope.payerSig.street1 = line1;
                }
                return '';
            },
            zipCode: function(zipCode) {
                if (typeof zipCode != 'undefined') {
                    $scope.payerSig.postalCode = zipCode;
                }
                return $scope.payerSig.postalCode;
            },
            distributionOffice: function(distributionOffice) {
                if (typeof distributionOffice != 'undefined') {
                    $scope.payerSig.city.bureauDistributeur = distributionOffice;
                }
                return $scope.payerSig.city.bureauDistributeur;
            },
            cityInseeCode: function(cityInseeCode) {
                if (typeof cityInseeCode != 'undefined') {
                    $scope.payerSig.city.codeInseeCommune = cityInseeCode;
                }
                return $scope.payerSig.city.codeInseeCommune;
            },
            line4: function(line4) {
                if (typeof line4 != 'undefined') {
                    $scope.payerSig.street4 = line4;
                }
                return '';
            },
            country: function(country) {
                if (typeof country != 'undefined') {
                    $scope.payerSig.country = country;
                }
                return $scope.payerSig.country;
            },
            fullComplement: function(fullComplement) {
                if (typeof fullComplement != 'undefined') {
                    $scope.payerSig.street2 = fullComplement ;
                }
                return $scope.payerSig.street2;
            } // fullComplement is necessarily the last key
        };

        Normalization.normalizeAddress(
            $scope,
            function (normalizationResult) {
                expose.resolve(normalizationResult)
            },
            function (normalizationResult) {
                expose.reject({code: '400', message: 'trop dommage ! :('})
            },
            addressDataMapper
        );

        return expose.promise;
    }
}

