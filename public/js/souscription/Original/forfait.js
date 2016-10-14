/**
 * Step 1: Choix forfait
 * *********************************************************************************
 */
SEL.App.prototype.ForfaitCtrl = function ($scope, $io, $location, $http, $sce, $route, $routeParams, $compile, Upload, $q, $cookieStore, $rootScope, Wording) {

    var second = false;
    $scope.error = null;
    $scope.errorMessages = Wording.getCategorie('sna').sna_erreur;

    $scope.$on('$viewContentLoaded', function(event) {
        SEL.APP.log("porteur template loaded");
        initCtrl();
    });

    $scope.$on('$locationChangeStart', function(event) {
        SEL.saveStep($scope);
    });

    var successCartCreate = function shoppingCartCreateInnerSuccess(data,
            status, headers, config, statusText) {
        response = true;
        SEL.HOLDER.profil.cartId = data;

        return;
    };

    var successStepLoad = function(data, status, headers, config, statusText) {
        response = true;
        SEL.APP.log(data);
        // SEL.HOLDER.profil.cartId = data;

        return;
    };

    var successUpdateStep = function(data) {
        var stepName = "/Porteur";
        SEL.MODEL.forfaitStep = true;
        SEL.MODEL.jumpStep(stepName);
        $rootScope.$broadcast("receiveResponse");
        $location.path(stepName);
    };

    var error = function(msg) {
        $scope.error = msg || "il y a des erreurs sur le formulaire";
        $rootScope.$broadcast("receiveResponse");
    }

    var isDateOnline = function() {
        return SEL.MODEL.isDateOnline();
    }

    var initCtrl = function() {
        SEL.APP.fall($location, {
        	"profil" : "/Profil"
        });
        $scope.disableSubmit = true;
        $scope.errorMessages = Wording.getCategorie('sna').sna_erreur;
        $scope = SEL.loadStep($scope);

        SEL.MODEL.forfaitStep = SEL.MODEL.forfaitStep || false;

        SEL.HOLDER.forfait.hasBeenReached        = true;
        SEL.HOLDER.porteur.hasBeenReached        = false;
        SEL.HOLDER.photo.hasBeenReached          = false;
        SEL.HOLDER.paiement.hasBeenReached       = false;
        SEL.HOLDER.recapitulatif.hasBeenReached  = false;
        SEL.HOLDER.signature.hasBeenReached      = false;
        //SEL.HOLDER.confirmation.hasBeenReached   = false;


        nextCase("init");


        $rootScope.$broadcast("receiveResponse");
    }

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
    var getZoneDetail = function (numZone) {
        for (var key in SEL.HOLDER.forfait.options) {
            if (SEL.HOLDER.forfait.options[key].value_option_value_id == numZone) {
                return SEL.HOLDER.forfait.options[key];
            }
        }

        return false;
    }

    $scope.submitForm = function() {
        $rootScope.$broadcast("sendRequest");
        $scope.formSubmitted = true;

        if ($scope.step_form.$invalid) {
            $rootScope.$broadcast("receiveResponse");

            return;
        }

        if ($scope.model1_date_forfait != null && $scope.model1_zone != null && isDateOnline()) {
            SEL.HOLDER.forfait.zone = $scope.model1_zone;

            var options = {};

            dateChosen = new Date();
            dateChosen.setMonth($scope.model1_date_forfait);

            $zoneOptionsId = $scope.cart.optionsId.zone;
            $dateOptionsId = $scope.cart.optionsId.date_forfait;

            options[ $zoneOptionsId ] = $scope.model1_zone;
            options[ $dateOptionsId ] = SEL.HOLDER.forfait.date;

            SEL.HOLDER.forfait.dateForfait = $scope.model1_date_forfait;
            SEL.HOLDER.forfait.zoneForfait = $scope.model1_zone;
            SEL.HOLDER.forfait.option = options;
            SEL.HOLDER.forfait.zoneForfaitDetail = getZoneDetail(SEL.HOLDER.forfait.zoneForfait);

            $scope.cart.options = options;
            $scope.cart.model1_date_forfait = $scope.model1_date_forfait;
            $scope.cart.model1_zone = $scope.model1_zone;
            $scope.cart.zoneForfaitDetail = getZoneDetail(SEL.HOLDER.forfait.zoneForfait);

            nextCase("porteur");

        } else if ($scope.model1_date_forfait != null && !isDateOnline()) {
            var displayed = SEL.MODEL.displayedForfaitMonthNumber();

            error("Le délai est trop court pour commander en ligne. Vous pouvez toutefois aller en agence ou choisir une date ultérieure ( le 1er "
                    + SEL.date.month.fr[displayed[1]] + " )");

        }
        $rootScope.$broadcast("receiveResponse");
        return;

    }

    var gotoStep = function(nextStep) {
        SEL.saveStep($scope);
        // if(nextStep == "/Photo"){
        // updateStep();
        // }
        $rootScope.$broadcast("receiveResponse");
        $location.path(nextStep);
    }

    var stepLoad = function() {
        var expose = $q.defer();
        var receive = $io.execute("stepLoad", {
            "params" : {
                "reference": $scope.userSel.reference || "",
                "email":     $scope.userSel.email || "",
                "hasCard":   $scope.userInfo.hasCard || "",
                "newUser":   $scope.userInfo.isNew || "",
                "userSig":   $scope.userSig || "",
                "payerSig":  $scope.payerSig || "",
                "userSel":   $scope.userSel || "",
                "userInfo":  $scope.userInfo || ""
            },
            "step" : "Forfait"
        });
        receive.then(function(data) {
            SEL.APP.log(data);
            expose.resolve(data);
        }, function(msg) {
            SEL.APP.log(msg);
            expose.reject(msg);
        });

        return expose.promise;
    }

    var stepSubmit = function() {
        var expose = $q.defer();
        var receive = $io.execute("stepSubmit", {
            "params" : {
                "options" : SEL.HOLDER.forfait.option,
                "cartId" : SEL.HOLDER.profil.cartId,
                "sku" : "navigo_annuel",
                "qty" : "1",
                "userSig":   $scope.userSig || "",
                "userSel":   $scope.userSel || "",
                "userInfo":  $scope.userInfo || ""
            },
            "step" : "Forfait"
        });
        receive.then(function(data) {
            expose.resolve(data);
        }, function(msg) {
            SEL.APP.log(msg);
            expose.reject(msg);
        });

        return expose.promise;
    }

    var setCartId = function(data) {
        var expose = $q.defer();
        SEL.HOLDER.profil.cartId = data.cartId;
        $scope.cart.cartId       = data.cartId;
        $scope.cart.optionsId = data.optionsId;
        $scope.cart.options   = data.options;
        expose.resolve(data);

        return expose.promise;
    }

    var renderForm = function(data) {
        SEL.APP.log(data);
        //data.cartId;
        SEL.MODEL.forfaitStep = true;

        // traitement de retour
        $scope = SEL.MODEL.loadForm("/Forfait", $scope, $cookieStore);
        $scope.setForfaitDate();

        $scope.Holder = SEL.HOLDER.porteur.data;
        $scope.Holder.forfait = SEL.HOLDER.forfait;


        SEL.HOLDER.forfait.options = data.options;

        $scope.cart.optionsId = data.optionsId;

        SEL.APP.log($scope.cart.optionsId);

        // SEL.formsData = data;
        // SEL.APP.log(SEL.formsData);

        // SEL.formStepsData = SEL.MODEL.parseFormsData(SEL.formsData);

        SEL.htmlForms.forfaitNote = SEL.MODEL.createNote();
        SEL.htmlForms.forfaitZone = SEL.MODEL.createForfaitSelectZone(data.options, Wording);
        SEL.htmlForms.forfaitDate = SEL.MODEL.createForfaitSelectDate(Wording);

        // SEL.htmlForms.forfait = SEL.MODEL
        // .createFormByStep(SEL.breadcrumb['/Forfait']);
        // SEL.APP.renderForm($scope, $compile, "forfait");

        SEL.VIEW.appendView($scope, $compile,
                angular.element(document.getElementById('form_step_forfait')))(
                SEL.htmlForms.forfaitDate);

        SEL.VIEW.appendView($scope, $compile,
                angular.element(document.getElementById('form_step_forfait')))(
                SEL.htmlForms.forfaitZone);

        SEL.VIEW.appendView($scope, $compile,
                angular.element(document.getElementById('form_step_forfait')))(
                SEL.htmlForms.forfaitButton);


        if (!$scope.model1_date_forfait) {
            $scope.model1_date_forfait = null;
        }
        //if (SEL.HOLDER.forfait.date && SEL.HOLDER.forfait.date.day) {
        if (SEL.HOLDER.forfait.dateForfait) {
            $scope.model1_date_forfait = SEL.HOLDER.forfait.dateForfait; //(parseInt(SEL.HOLDER.forfait.date.month) + 11) % 12;
            $scope.setForfaitDate();
        }

        if (SEL.HOLDER.forfait && SEL.HOLDER.forfait.zone) {
            $scope.model1_zone = SEL.HOLDER.forfait.zone;
        }


        SEL.HOLDER.forfait.alreadyRender = true;

    };

    /*
     *
     * var showDEDIMessage = function() { $scope.error =
     * $scope.errorMessages["SNA-CO-EC01-ERR_008"]; };
     */
    var disableSubmit = function() {
        $scope.disableSubmit = true;
    };

    var enableSubmit = function() {
        $scope.disableSubmit = false;
    };

    var completeStep = function(){
        SEL.MODEL.Holder.forfait.valid = true;
    };

    var gotoNextStep = function() {
        SEL.MODEL.forfaitStep = true;
        completeStep();
        gotoStep("/Porteur");
    };

    var nextCase = function(orderCase) {
        $scope.orderCase = $scope.orderCase || orderCase || false;
        var useCase = getCase();
        $scope.orderCase = false;
        switch (useCase) {
        case "init":
            SEL.APP.log("init");
            if (SEL.HOLDER.forfait.alreadyRender) {
                renderForm(SEL.HOLDER.forfait);
            }
            stepLoad() // fait chargement options + crée le panier en back

            .then(setCartId, error)
            .then(
                function(data) {
                    if(!SEL.HOLDER.forfait.alreadyRender) {
                        renderForm(data)
                    }
                },
                error
            );
            break;
        /*
         * case "FP_NA_actif2": SEL.APP.log("FP_NA_actif2"); disableSubmit();
         * showNAActifMessage(); break;
         */
        case "porteur":
            stepSubmit().then(gotoNextStep, error);
            break;
        default:
            defaultCase();
        }
    }

    $scope.setForfaitDate = function() {
        var date = new Date();
        var day = "01";
        var month = (parseInt($scope.model1_date_forfait) % 12) + 1;

        if ($scope.model1_date_forfait == null) {
            var currentDay = date.getDate();
            var displayed = SEL.MODEL.displayedForfaitMonthNumber();
            var defaultSelect = currentDay < 17 ? displayed[0] + "" : displayed[1] + "";

            month = (parseInt(defaultSelect) % 12) + 1;
            $scope.model1_date_forfait = defaultSelect;
        }

        month = month < 10 ? "0" + month : "" + month;

        var year = parseInt(date.getFullYear());
        year = $scope.model1_date_forfait < date.getMonth() ? year + 1
                : year;

        var userDate = {
            "day" : "01",
            "month" : month,
            "year" : year
        };

        year = "" + year;

        SEL.MODEL.setHolderForfaitDate(userDate);
    };

    $scope.setForfaitZone = function() {
        SEL.MODEL.setHolderForfaitZone($scope.model1_zone);
    }

}

/**
 * Step 2: Choix forfait
 * *********************************************************************************
 */

SEL.Model.prototype.createForfaitSelectZone = function(oOptions, Wording) {

	var begin = '             <div class="form-group">'
            + '                   <div class="col-xs-12 col-sm-12 col-md-4">'
			+ '                       <label for="choix-forfait" class="control-label">' + Wording.get('sna.sna_forfait.titre_zone') + '<span class="star">*</span></label>'
            + '                   </div>'
			+ '                   <div class="col-xs-11 col-sm-10 col-md-4" id="forfait_select_zone">';

    var selectStart = '';
    var selectEnd = '</select>';
    var model = 'model1_zone';
    var options = "";


    var end = '                     </div>'
			+ '                     <div class="col-xs-12 col-sm-12 col-md-4">'
            + '                         <div class="box_action_show_error">'
            + '                             <a href="#" class="action_show_error">'
            + '                                 <img ng-src="{{ element.image || \'../front/bundles/sel/images/picto_information.png\' }}" alt="" />'
            + '                             </a>'
			+ '                             <div id="phone-info" class="tooltip right tel" role="tooltip">'
			+ '                                <div class="tooltip-arrow"></div>'
			+ '                                <div class="tooltip-inner">' + Wording.get('sna.sna_forfait.info_prelevement_generale') + '</div>'
			+ '                             </div>'
            + '                         </div>'
			+ '                     </div>'
            + '                 </div>'
            + '                 <div class="form-content"></div>';

    var i = 0;
    SEL.HOLDER.forfait.zones = {};
    //SEL.HOLDER.forfait.zone = null;

    SEL.APP.log("createForfaitSelectZone : " + oOptions);
    for ( var optionKey in oOptions) {

        var option = oOptions[optionKey];

        obj = {};
        obj.id = option.value_option_value_id;
        obj.shortTitle = option.title;
        obj.selectTitle = option.title + ' à '
                + SEL.provides.$filter('number')(option.price, 2) + '€/mois';
        obj.longTitle = SEL.provides.$filter('number')(option.price, 2)
                + Wording.get('sna.sna_forfait.info_prelevement_specifique');
        obj.price = option.price;

        /*
        SEL.HOLDER.forfait.zones[option.value_option_value_id] = obj;
        if (SEL.HOLDER.forfait.zone == null) {
            SEL.HOLDER.forfait.zone = obj.id;
        }*/

		if (i == 0) {
			selectStart = '<select ng-change="setForfaitZone()"' + ' ng-init="'
					+ model + ' = ' + option.value_option_value_id + '"'
					+ ' ng-model="' + model + '"' + ' placeholder="'
					+ option.value_option_value_id
					+ '" class="form-control">';
		}

        options += '<option ' + 'value="' + option.value_option_value_id + '">'
                + option.title + ' à '
                + SEL.provides.$filter('number')(option.price, 2) + '€/mois'
                + '</option>';
        i++;
    }

    return begin + selectStart + options + selectEnd + end;
};

//SEL.Model.prototype.createForfaitSelectZoneOld = function(step, id_form,
//		numFormData) {
//	var begin = '             <div class="form-group">'
//			+ '                     <label for="choix-forfait" class="col-xs-12 col-sm-4 col-md-4 control-label">Les zones dont vous avez besoin ?<span class="star">*</span></label>'
//			+ '                     <div class="col-xs-11 col-sm-6 col-md-4" id="forfait_select_zone">';
//
//    var selectStart = '';
//    var selectEnd = '</select>';
//    var model = 'model' + step + '_' + id_form;
//    var options = "";
//
//	var end = '                     </div>'
//			+ '                     <div class="col-xs-12 col-sm-12 col-md-4">'
//            + '                         <div class="box_action_show_error">'
//            + '                             <a href="#" class="action_show_error">'
//            + '                                 <img  src="/sel/web/front/bundles/sel/images/picto_information.png" alt="" />'
//            + '                             </a>'
//			+ '                             <div id="phone-info" class="tooltip right tel" role="tooltip">'
//			+ '                                <div class="tooltip-arrow"></div>'
//			+ '                                <div class="tooltip-inner">'
//			+ '                                   Mensualité prélevée sur 11 mois + 7,60 € de frais de dossier prélevés en une seule fois'
//			+ '                                 </div>'
//			+ '                             </div>'
//            + '                         </div>'
//			+ '                     </div>' + '             </div>'
//			+ '         </div>';
//
//    var i = 0;
//    SEL.HOLDER.forfait.zones = {};
//    SEL.HOLDER.forfait.zone = null;
//
//    for ( var optionKey in numFormData.values) {
//
//        var option = numFormData.values[optionKey];
//
//        obj = {};
//        obj.id = option.value_option_value_id;
//        obj.shortTitle = option.title;
//        obj.selectTitle = option.title + ' à '
//                + SEL.provides.$filter('number')(option.price, 2) + '€/mois';
//        obj.longTitle = SEL.provides.$filter('number')(option.price, 2)
//                + '€/mois sur 11 mois + 7.60€ de frais de dossier prélevés une seule fois';
//        obj.price = option.price;
//
//        SEL.HOLDER.forfait.zones[option.value_option_value_id] = obj;
//        if (SEL.HOLDER.forfait.zone == null) {
//            SEL.HOLDER.forfait.zone = obj.id;
//        }
//
//        if (i == 0) {
//            selectStart = '<select ng-change="setForfaitZone()"' + ' ng-init="'
//                    + model + ' = ' + option.value_option_value_id + '"'
//                    + ' ng-model="' + model + '"' + ' placeholder="'
//                    + option.value_option_value_id
//                    + '" class="form-control chosen-select">';
//        }
//
//        options += '<option ' + 'value="' + option.value_option_value_id + '">'
//                + option.title + ' à '
//                + SEL.provides.$filter('number')(option.price, 2) + '€/mois'
//                + '</option>';
//        i++;
//    }
//
//    return begin + selectStart + options + selectEnd + end;
//};

SEL.Model.prototype.createForfaitSelectDate = function() {
    var model = 'model1_date_forfait';

    var begin = '             <div class="form-group">'
			+ '                 <div class="col-xs-12 col-sm-12 col-md-4">'
			+ '                     <span class="radio_label"><strong>Date de début de votre forfait ? </strong><span class="star">*</span></span>'
			+ '                 </div>'
			+ '                 <div class="col-xs-12 col-sm-12 col-md-4">'
			+ '                     <div class="radio" id="date_22">';

	var end = '                     </div>'
			+ '                 </div>'
			+ '             </div>'
			+ '             <p><span class="mess-error" ng-show="'
			+ model
			+ '== null && formSubmitted">{{errorMessages[\'IHM-TRANS-ERR_001\']}}</span></p>';
	var displayed = SEL.MODEL.displayedForfaitMonthNumber();

    var form = '<input type="radio" name="inlineRadioOptions" id="inlineRadio1" ng-change="setForfaitDate()" ng-model="'
            + model
            + '" value="'
            + displayed[0]
            + '" required>'
            + '<label class="radio-inline" for="inlineRadio1">'
            + 'Le 1er '
            + SEL.date.month.fr[displayed[0]]
            + '</label>'
            + '<input type="radio" name="inlineRadioOptions" id="inlineRadio2" ng-change="setForfaitDate()" ng-model="'
            + model
            + '" value="'
            + displayed[1]
            + '" required>'
            + '<label class="radio-inline" for="inlineRadio2">'
            + 'Le 1er '
            + SEL.date.month.fr[displayed[1]] + '</label>';

    return begin + form + end;
}

//SEL.Model.prototype.createForfaitSelectDateOld = function(step, id_form,
//        numFormData, sendParam) {
//    var model = 'model' + step + '_' + id_form;
//    var begin =
//
//	'             <div class="form-group">'
//			+ '                 <div class="col-xs-12 col-sm-4 col-md-4">'
//			+ '                     <span class="radio_label"><strong>Date de début de votre forfait ? </strong><span class="star">*</span></span>'
//			+ '                 </div>'
//			+ '                 <div class="col-xs-4">'
//			+ '                     <div class="radio" id="date_22">';
//
//	var end = '                     </div>'
//			+ '                 </div>'
//			+ '             </div>'
//			+ '             <p><span class="mess-error" ng-show="'
//			+ model
//			+ '== null && formSubmitted">{{errorMessages[\'IHM-TRANS-ERR_001\']}}</span></p>';
//	var displayed = SEL.MODEL.displayedForfaitMonthNumber();
//
//    var form = '<input type="radio" name="inlineRadioOptions" id="inlineRadio1" ng-change="setForfaitDate()" ng-model="'
//            + model
//            + '" value="'
//            + displayed[0]
//            + '" required>'
//            + '<label class="radio-inline" for="inlineRadio1">'
//            + 'Le 1er '
//            + SEL.date.month.fr[displayed[0]]
//            + '</label>'
//            + '<input type="radio" name="inlineRadioOptions" id="inlineRadio2" ng-change="setForfaitDate()" ng-model="'
//            + model
//            + '" value="'
//            + displayed[1]
//            + '" required>'
//            + '<label class="radio-inline" for="inlineRadio2">'
//            + 'Le 1er '
//            + SEL.date.month.fr[displayed[1]] + '</label>';
//
//    return begin + form + end;
//}

SEL.Model.prototype.dateDiff = function(toDate, fromDate) {
    var magicNumber = (1000 * 60 * 60 * 24);

    if (toDate && fromDate) {
        var dayDiff = Math.floor((toDate - fromDate) / magicNumber);
        if (angular.isNumber(dayDiff)) {
            return dayDiff + 1;
        }
    }
}

/**
 * @return one or two month number
 */
SEL.Model.prototype.isPossibleInlineForfaitMonth = function(monthNumber) {
    var date = new Date();
    var month = date.getMonth();
    var day = date.getDate();
    var possible = [ (month + 2) % 12 ];

    if (day < 17) {
        possible.push((month + 1) % 12);
    }

    return SEL.MODEL.inArray(possible, monthNumber);
}

SEL.Model.prototype.isDateOnline = function(monthNumber) {
    return this.isPossibleInlineForfaitMonth(((parseInt(SEL.HOLDER.forfait.date.month) + 11) % 12));
}
SEL.Model.prototype.displayedForfaitMonthNumber = function() {
    var date = new Date();
    var month = date.getMonth();
    var day = date.getDate();

    var displayed = [ (month + 1) % 12, (month + 2) % 12 ];

    return displayed;
}

SEL.Model.prototype.setHolderForfaitDate = function(date) {
    SEL.HOLDER.forfait.date = date;
}

SEL.Model.prototype.getHolderForfaitDate = function() {
    return SEL.HOLDER.forfait.date;
}

SEL.Model.prototype.getHolderForfaitZone = function() {
    return SEL.HOLDER.forfait.zone;
}

SEL.Model.prototype.setHolderForfaitZone = function(zone) {
    SEL.HOLDER.forfait.zone = zone;
}

SEL.Model.prototype.shoppingCartProductAdd = function(param, success, error) {
    SEL.Model.prototype.httpPost(SEL.routes.shoppingCartProductAdd, param,
            success, error);
}
