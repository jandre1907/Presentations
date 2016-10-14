window.SEL = window.SEL || {};
 /*********************************************************************************************************
 * Model Part
 *********************************************************************************************************/
SEL.Model = function(){
    this.log = function(utext) {
        if (console && console.log){
            console.log("Model");
            console.log(utext);
        } else {
            return function(){
                return true;
            }
        }
    };
};

SEL.provides = {
    $http: {},
    $sce: {},
    $scope: {},
    $location: {},
    $compile: {},
    $filter:{}
};



SEL.Model.prototype.saveForm = function(key, data, $cookieStore){
    savingData = {};
    switch(key) {
        case "Formulaire":
            savingData = {
                "mail": data.mail,
                "cgv": data.cgv,
                "birthDate": data.birthDate,
                "birthYear": data.birthYear,
                "birthMonth": data.birthMonth,
                "birthDay": data.birthDay,
                "reference": data.reference,
                "referenceUnknown": data.referenceUnknown,
                "hasCard": data.hasCard
            };
            break;
        case '/Profil':
            savingData = {
                "isUser": data.isUser,
                "hasCard": data.hasCard
            };
            break;
        case '/Forfait':
            savingData = {
                "dateForfait": data.model1_date_forfait,
                "zoneForfait": data.model1_zone
            };
            break;
        default :
            savingData = data;
    }

    try {
        $cookieStore.put(key, savingData);
    } catch(e) {
        this.log(e);
    }
};

SEL.Model.prototype.loadForm = function(key, data, $cookieStore){
    data = data || {};
    try {
        var cookie = $cookieStore.get(key);
        if(typeof cookie != "undefined")
        {
            switch(key) {
            case '/Profil':
                data.isUser = cookie.isUser;
                data.hasCard = cookie.hasCard;
                break;
            case '/Forfait':
                data.model1_zone = cookie.zoneForfait;
                data.model1_date_forfait = cookie.dateForfait;
            break;
            default :
                data = cookie;
            }
        }
        return data;
    } catch(e) {
        this.log(e);
        return data;
    }
    var defaultRes = {};
    return defaultRes;
};
SEL.routes = {

//signature parcours porteur==payeur
    "createPdf" : "api/contralia/initialize", //post cartid:reference: param: user
    "getContractPdf":    "api/contralia/simplepdf/contrat.pdf",
    "getMandatPdf":      "api/contralia/simplepdf/mandat.pdf",
    "getContractHtml":   "api/contralia/simplepdf/contrat.html",
    "getMandatHtml":     "api/contralia/simplepdf/mandat.html",
    "getHolderSmsOtp":   "api/contralia/otp/sms.json",
    "getHolderEmailOtp": "api/contralia/otp/email.json",
    "checkOtp":          "api/contralia/check",
    "closeSignature":    "api/contralia/cloturer.json",
    // "getSignedContractPdf": "api/contralia/pdf/{contrat|mandat}"


//signature parcours porteur!=payeur
//holder side
    "getHolderContractPdf":  "api/contralia/simplepdf/contrat.pdf",
    "getHolderContractHtml": "api/contralia/simplepdf/contrat.html",
    "isHolderConsent":       "api/contralia/consentement.json",
//payer side
    "sendTokenMail":          "api/contralia/recuperer.json",
    "getPayerContractPdf":    "api/contralia/simplepdf/contrat.pdf",
    "getPayerMandatPdf":      "api/contralia/simplepdf/mandat.pdf",
    "getPayerContractHtml":   "api/contralia/simplepdf/contrat.html",
    "getPayerMandatHtml":     "api/contralia/simplepdf/mandat.html",
    "getPayerSmsOtp":         "api/contralia/otp/sms.json",
    "getPayerEmailOtp":       "api/contralia/otp/email.json",
    "checkPayerOtp":          "api/contralia/check",
    "closePayerSignature":    "api/contralia/cloturer.json",
    // "getSignedContractPdf": "api/contralia/pdf/{contrat|mandat}"
    "saveContractSig":        "/api/sig/holder/contract/save.json",

    "getClientByNumber":             "rest/sig/clientbynumber.json",
    "getCitiesByPostCode":           "rest/sig/cities/postal/code.json",
    "searchUserAndSave":             "api/sig/search/client/and/save.json",
    "getClientByReferenceBirthDate": "api/sig/client/by/reference/birth/date.json",
    "getClientByPhysicIdentity":     "api/sig/client/by/identity/physic.json",
    "createUser":                    "api/create/user.json",

    "validIban":                    "api/sig/valid/bic/iban.json",//"api/valid/iban.json",//sepalia
    "catalogProductForm":           "api/form/navigo_annuel/product/abo.json",
    "shoppingCartCreate":           "api/create/cart.json",
    "shoppingCartProductAdd":       "api/add/product/to/cart.json",
    "customerCustomerForm":         "api/form/customer.json",
    "customerCustomerCreate":       "api/customer/create.json",
    "putCustomerAddress" :          "api/customer/address.json",
    "putCustomerCartAddress" :      "api/customer/cart/address.json",
    "putCartCustomer":              "api/cart/customer.json",
    "updateCartProducts":           "api/update/cart/products.json",
    "updateStep":                   "api/update/step.json",
    "createOrder":                  "api/create/order.json",
    "updateCarteItemAttribute":     "",
    "paymentFormMethod":            "",
    "putCartPaymentMethod":         "api/cart/payment/method.json",
    "shoppingCartPaymentMethod":    "",
    "orderSummary":                 "",
    "shoppingCartOrder":            "",
    // subscription steps
    "stepLoad":                    "api/step/load.json",
    "stepSubmit":                  "api/step/submit.json",
};

SEL.routes2 = {
    "getUserCase": {
        "url": "api/user/context.json",
        "method": "GET"
    },
    "createUserSel": {
        "url": "api/createUserSel.json",
        "method": "POST"
    },
    "createFullUserSel": {
        "url": "api/create/user.json",
        "method": "POST"
    },
    "isUserSel": {
        "url": "api/isUser.json",
        "method": "GET"
    },
    "getUserSel": {
        "url": "api/getUser.json",
        "method": "GET"
    },
    "updateUserSel": {
        "url": "api/update/user/sel.json",
        "method": "POST"
    },
    "searchUserSig": {
        "url": "api/sig/searchClientSig.json",
        "method": "GET"
    },
    "getUserSigByReferenceAndBirthDate": {
        "url": "api/sig/client/by/reference/birth/date",
        "method": "GET"
    },
    "searchUserAndSave": {
        "url": "api/sig/search/client/and/save.json",
        "method": "POST"
    },
    "getUserSigByReference": {
        "url": "rest/sig/clientbynumber.json",
        "method": "GET"
    },
    "getCities": {
        "url": "rest/sig/cities/postal/code.json",
        "method": "GET"
    },
    "updateUserAddressSel": {
        "url": "api/updateUserAddressSel.json",
        "method": "POST"
    },
    "updateUserSel": {
        "url": "api/updateUserSel.json",
        "method": "POST"
    },
    "processOrder": {
        "url": "api/form/process/order.json",
        "method": "POST"
    },
    "updateUserSelFull" : {
        "url": "api/updateUserSelFull.json",
        "method": "POST"
    },
    "customerCustomerCreate" : {
        "url": "api/customer/create.json",
        "method": "POST"
    },
    "putCustomerAddress" : {
        "url": "api/customer/address.json",
        "method": "PUT"
    },
    "putCustomerCartAddress" : {
        "url": "api/customer/cart/address.json",
        "method": "PUT"
    },
    "putCartCustomer" : {
        "url": "api/cart/customer.json",
        "method": "PUT"
    },
    "updateStep" : {
        "url": "api/update/step.json",
        "method": "PUT"
    },
    "stepLoad" : {
        "url": "api/step/load.json",
        "method": "GET"
    },
    "stepSubmit" : {
        "url": "api/step/submit.json",
        "method": "POST"
    }
};
SEL.Model.prototype.dateValid = function(clientDay,clientMonth,clientYear) {

    var date       = new Date();
    var dateMonth  = date.getMonth();
    var dateYear   = date.getFullYear();
    var dateDay    = date.getDay();
    var age        = dateYear - clientYear;
    var bissextile = false;
    var dateInfos  = { typeIsValid : "true", fevrier : "true" , ageIsValid : "true", toYoung : "false", ndDayPerMonthIsValid:"true"};

//**************controle type donnéess utilisateur*********
    if (typeof clientDay != "undefined" && clientMonth < 13 && clientMonth > 0) {
//******** gestion d'années bissextile pour fevrier*******
        if (clientMonth == 02 && clientDay > 28 ) {
            if (clientYear % 4   !== 0 ||
                clientYear % 100 !== 0 ||
                clientYear % 400 !== 0) {
                dateInfos.fevrier = "false";
            }
        };
        if (dateInfos.fevrier == "true") {
    //********nombre de mois && nombre d'années***************
            ndDayForMonth = (new Date(Date.parse(((clientMonth % 12) + 1).toString() + "/01/" + clientYear) - 86400000)).getDate();
            if (clientDay > ndDayForMonth) {
                dateInfos.ndDayPerMonthIsValid = "false";
            };
    //************controle de l'age****************************

            if (age > 200) {
                dateInfos.ageIsValid = "false";
            }
            else if (age < 4){
                dateInfos.toYoung = "true";
            }
        };
    }
    else {
        dateInfos.typeIsValid = "false";
    };
    return dateInfos;
//type chiffre uniquement Day:int x 2,month:int x 2, year: int x 4
//controle 28,29,30,31 et année bisextile
//pas plus de 200ans
};
SEL.htmlForms = {};

SEL.breadcrumb = {
		'/Profil': 0,
		'/Identification': 0.1,
		'/IdentificationHelp': 0.2,
		'/IdentificationSuite': 0.3,
		'/IdentificationFin': 0.4,
		'/echec_identification': 0.5,
		'/Forfait': 1,
		'/Porteur': 2,
		'/Photo': 3,
		'/Paiement': 4,
		'/Paiement2': 4.1,
		'/Recapitulatif': 5,
		'/Signature': 6,
		'/Signature': 6.1,
		'/Confirmation': 7,
		'/Confirmation2': 7.1
		};

SEL.date = {
    month:{
        'fr' : ['Janvier','Février','Mars',
                'Avril','Mai','Juin',
                'Juillet','Août','Septembre',
                'Octobre','Novembre','Décembre'
        ]
    }
};

SEL.Model.prototype.inArray = function(t_array, needle) {
    for (var i=0; i < t_array.length; i++) {
        if(t_array[i] == needle) {
            return true;
        }
    }

    return false;
}

SEL.Model.prototype.id_form = {
    "forfait" : {
        "zone": "zone",
        "date": "date_forfait"
    }
}

SEL.Model.prototype.Holder = {
    "profil": {
        "valid": false,
        "hasBeenReached": false,
        "path": "#Profil",
        "hasCard": null,
        "isUser": null,
        "isCartCreated":false,
        "cartId": null
    },
    "rattachement": {
        "valid": false,
        "hasBeenReached": false,
        "path": "#Rattachement",
        "hasCard": null,
        "isUser": null
    },
    "identification": {
        "valid": false,
        "hasBeenReached": false,
        "path": "#Identification",
        "hasCard": null,
        "isUser": null
    },
    "identificationHelp": {
        "valid": false,
        "hasBeenReached": false,
        "path": "#IdentificationHelp",
        "hasCard": null,
        "isUser": null
    },
    "identificationSuite": {
        "valid": false,
        "hasBeenReached": false,
        "path": "#IdentificationSuite",
        "hasCard": null,
        "isUser": null
    },
    "identificationFin": {
        "valid": false,
        "hasBeenReached": false,
        "path": "#IdentificationFin",
        "hasCard": null,
        "isUser": null
    },
    "identificationFailure": {
        "valid": false,
        "hasBeenReached": false,
        "path": "#IdentificationFailure",
        "hasCard": null,
        "isUser": null
    },
    "forfait": {
        "valid": false,
        "hasBeenReached": false,
        "path": "#Forfait",
        "date": null,
        "zone": null,
        "expectedDate": null,
        "rebuildForm":false
    },
    "porteur": {
        "valid": false,
        "hasBeenReached": false,
        "path": "#Porteur"
    },
    "photo": {
        "valid": false,
        "hasBeenReached": false,
        "path": "#Photo"
    },
    "paiement": {
        "valid": false,
        "hasBeenReached": false,
        "path": "#Paiement"
    },
    "paiement2": {
        "valid": false,
        "hasBeenReached": false,
        "path": "#Paiement2"
    },
    "recapitulatif": {
        "valid": false,
        "hasBeenReached": false,
        "path": "#Recapitulatif"
    },
    "signature": {
        "valid": false,
        "hasBeenReached": false,
        "path": "#Signature"
    },
    "signature2": {
        "valid": false,
        "hasBeenReached": false,
        "path": "#Signature2"
    },
    "Confirmation": {
        "valid": false,
        "hasBeenReached": false,
        "path": "#Confirmation"
    },
    "Confirmation2": {
        "valid": false,
        "hasBeenReached": false,
        "path": "#Confirmation2"
    }
};

SEL.Model.prototype.getDataFromCookie = function ($cookieStore) {
    try {
        SEL.HOLDER.porteur.data = $cookieStore.get('Holder');
    } catch (e) {
        SEL.HOLDER.porteur.data = {};
    }

    try {
        SEL.PAYER = $cookieStore.get('Payer');
    } catch (e) {
        SEL.PAYER = {};
    }

}

SEL.Model.prototype.saveDataToCookie = function ($cookieStore) {
    $cookieStore.put('Holder', SEL.HOLDER.porteur.data);
    $cookieStore.put('Payer', SEL.PAYER);
}
SEL.Model.prototype.statutClient = {

        "ACTIF"     : "Actif",
        "DECEDE"    : "Décédé",
        "EXCLU"     : "Exclu",
        "INEXISTANT": "Inexistant",
        "DOUBLON"   : "Doublon",
        "NPAI"      : "nPAI"
}
SEL.Model.prototype.userDefault = function () {
    return {
        "clientNumber": null,
        "dateNaissance":null,
        "prenom": null,
        "nom": null,
        "codePostal": null,
        "eMail": "",
        "eMail2": "",
        "password": "",
        "password2": "",
        "codeProduit": null,
        "save": true,
        "update": true,
        "regroupementPrelevements": null,
        "telephoneFixe": null,
        "telephoneMobile": null,
        "codeCategorieSocioProfessionnelle": '01',
        "reference": null,
        "sollicitationAutresProduits": 0,
        "bureauDistributeur": null,
        "donneesCommunicables": 0,
        "ligne3": null,
        "ligne2": null,
        "ligne1": null,
        "codeInseeCommune": null,
        "city":null,
        "pays": "France",
        "ligne4": null,
        "dateEffet": null,
        "raisonSociale": null,
        "civilite": null,
        "referenceHebergeur": null,
        "website_id": 1,
        "store_id": 1,
        "isNotPayer": false,
        "photoUrl": null,
        "debug": null
    };
}

SEL.Model.prototype.cartDefault = {
    "cartId":null,
    "product": {
        "sku":"navigo_annuel",
        "zone": null,
        "date": null,
    }
}

SEL.Model.prototype.getCities = function(user, postalCode, $q, $scope, success, error) {

    var deffered = $q.defer();

    success = success || function innerSuccessgetCitiesByPostCode(data, status, headers, config, statusText) {
        if (data.messageAnomalie || !data.resultatCommunes.communes) {
            $scope.error = SEL.HOLDER.porteur.info.fr.cities;
            return;
        }

        cities = [];
        if(typeof data.resultatCommunes.communes.length != "undefined") {
            for(var i=0; i < data.resultatCommunes.communes.length; i++) {
                var city = data.resultatCommunes.communes[i];
                cities.push(city);
                cities[i].label = city.libelle;
            }
        } else {
            var city = data.resultatCommunes.communes;
            cities.push(city);
            cities[0].label = city.libelle;
        }

        user.codePostal = cities[0].codePostal;
        user.codeInsee = cities[0].codeInsee;
        user.bureauDistributeur = cities[0].bureauDistributeur;
        user.city = cities[0].libelle;

        deffered.resolve({"user":user, "cities":cities});

    }

    var rejection = function() {
        deffered.reject(error);
    }


    if(postalCode.length >= 5) {
        $scope.cities = [];
        SEL.MODEL.getCitiesByPostCode({"codePostal" : postalCode}, success, rejection);
    }

    return deffered.promise;
}

/**
insert les données de news dans olds, les écrases si elles sont présente.
*/
SEL.Model.prototype.overwriteObject = function (news, olds, option) {
    news = news || {};
    olds = olds || {};
    if (typeof option == "undefined") {
        for(var key in olds) {
            olds[key] = olds[key] || news[key];
        }
    };

    for(var key in news) {
        olds[key] = news[key];
    }
    return olds;
}

SEL.Model.prototype.getPayer = function(){
    SEL.PAYER = SEL.PAYER || SEL.MODEL.userDefault();
    return SEL.PAYER;
};

SEL.Model.prototype.parseFormsData = function (formsData) {
    var forms = {};

    for (var key in formsData.product.form) {
        var formData = formsData.product.form[key];
        var step = formData.form_step;
        if (typeof forms[step] == "undefined"){
            forms[step] = [];
        };

        forms[step].push(formData);
    }

    return forms;
}

SEL.Model.prototype.createFormByStep = function (step) {
    var formData = SEL.formStepsData[step];
    var htmlForms = {
        byIdForm: {},
        byPosition:[],
    };
    var i=0;
    for (var numForm in formData) {
        var htmlForm = "";
        var numFormData = formData[numForm];
        var id_form = numFormData.form_uniqueid;
        var lineNumber = numFormData.form_line;
        htmlForms.byIdForm[id_form + "" ] = {};
        htmlForms.byPosition[lineNumber] = [];
        var sendParam = numFormData.value_option_id;

        SEL.MODEL.log("numformData");
        SEL.MODEL.log(numFormData);

        switch (id_form + "") {
            case "zone":
                htmlForm = this.createForfaitSelectZone(step, id_form, numFormData);
                break;
            case "date_forfait":
                htmlForm = this.createForfaitSelectDate(step, id_form, numFormData);
                break;
            case "2":
                htmlForm = this.createPrefixHolderForm(step, id_form, numFormData);
                break;
            case "3":
                htmlForm = this.createfirstNameHolderForm(step, id_form, numFormData);
                break;
        }

        htmlForms.byIdForm[id_form + ""].sendParam = sendParam;
        htmlForms.byPosition[lineNumber][numFormData.form_col] = htmlForm;
        i++;
    }

    return  htmlForms;
}

SEL.Model.prototype.httpGet = function(url, param, success, error) {
    SEL.MODEL.log('httpSend');
    SEL.provides.$http
        .get(url,
            {
                // "transformResponse": function(d, h){return d},
                "params": param,
                "responseType": "json"
            }
        )
        .success(success)
        .error(error || SEL.MODEL.defaultError);
};

 SEL.Model.prototype.httpGetRaw = function(url, param, success, error) {
     SEL.MODEL.log('httpSend');
     SEL.provides.$http
         .get(url,
         {
             "transformResponse": function(d, h){return d},
             "params": param
         }
     )
         .success(success)
         .error(error || SEL.MODEL.defaultError);
 };

SEL.Model.prototype.httpPost = function(url, param, success, error) {
    SEL.MODEL.log('httpSend');
    SEL.provides.$http
        .post(url, param
            /*{
                // "transformResponse": function(d, h){return d},
                 param
            }*/
        )
        .success(success)
        .error(error || SEL.MODEL.defaultError);
};

SEL.Model.prototype.httpPut = function(url, param, success, error) {
    SEL.MODEL.log('httpSend');
    SEL.provides.$http
        .put(url, {'param': param})
        .success(success)
        .error(error || SEL.MODEL.defaultError);
};

/*SEL.Model.prototype.updateCartProduct = function(cartId) {
    var success = function(data, status, headers, config, statusText){

    };

    var error = function(data, status, headers, config, statusText){

    };

    MODEL.HOLDER.cartId;

    SEL.MODEL.httpPut(SEL.routes.updateCartProducts, {"cartId":this.routesMODEL.HOLDER.cartId}, success, error);

}*/

SEL.Sender = function($http) {
    this.send = function(method, url, param, success, error, options) {

        method = method || "default";
        switch(method) {
            case 'GET':
                httpGet(url, param, success, error, options);
                break;
            case 'GETRAW':
                httpGetRaw(url, param, success, error, options);
                break;
            case 'POST':
                httpPost(url, param, success, error , options);
                break;
            case 'PUT':
                httpPut(url, param, success, error, options);
                break;
            case 'DELETE':
                httpDelete(url, param, success, error, options);
                break;
            case 'PATCH':
                httpPatch(url, param, success, error, options);
                break;
            default:
                httpGet(url, param, success, error, options);
        }
    };

    var httpGet = function(url, param, success, error, options) {
        SEL.MODEL.log('http get');
        $http
            .get(url,
                {
                    "params": param,
                    "responseType": "json"
                },
                options
            )
            .success(success)
            .error(error);
    };

    var httpGetRaw = function(url, param, success, error, options) {
        SEL.MODEL.log('http get');
        $http
            .get(url, param, options)
            .success(success)
            .error(error);
    };

    var httpPost = function(url, param, success, error, options) {
        SEL.MODEL.log('http post');
        $http
            .post(url, param, options)
            .success(success)
            .error(error);
    };

    var httpPut = function(url, param, success, error, options) {
        SEL.MODEL.log('http put');
        $http
            .put(url,param,options)
            .success(success)
            .error(error);
    };
}

SEL.Model.prototype.createButton = function (stepName, Wording) {
    var content =
'        <div class="row">'
+'             <div class="col-xs-12 text-center">'
+'                 <button type="button" class="btn btn-primary aide-photo-btn"  ng-click="submitForm()" title="' + Wording.get('sna.sna_forfait.btn_ok_label') + '"><span>Continuer</span></button>'
+'             </div>'
+'         </div>'
;

    return content;
}


SEL.Model.prototype.createNote = function (stepName) {
    var content =
'         <span class="obligatoire">'
+'             <span class="star">*</span>'
+'             Champs obligatoire'
+'         </span>'
;

    return content;
}


//flag by step
SEL.Model.prototype.photoStep = false;
SEL.Model.prototype.paymentStep = false;

SEL.initArray = function(start, end) {
    var res = [];
    for (var i = start; i <= end; i++) {
        res.push(i < 10 ? "0" + i : "" + i);
    };

    return res;
}

SEL.Model.prototype.jumpStep = function (stepName) {
     SEL.APP.log("step jump " + stepName);
 }

SEL.fillBirthDate = function($scope) {
    $scope.days   = SEL.initArray(1,31);
    $scope.months = SEL.initArray(1,12);
    $scope.years  = SEL.initArray(1890 , 1900 + (new Date()).getYear());

    return $scope;
};

SEL.saveStep = function(currentObject) {
    //TODO in cookies
    currentObject = currentObject || {};
    for(key in SEL.objects) {
        SEL.objects[key] = currentObject[key];
    }

    SEL.adaptObjectsToHolder();

    return currentObject;
};

SEL.loadStep = function(currentObject) {
    currentObject = currentObject || {};
    SEL.loadHolderInObjects();
    for (key in SEL.objects){
        currentObject[key] = SEL.objects[key];
    }

    return currentObject;
};



SEL.adaptObjectsToHolder = function(){
    SEL.HOLDER.porteur.data.isNew =         SEL.objects.userSig.isNew;
    SEL.HOLDER.porteur.data.isNotPayer =    SEL.objects.userSig.isNotPayer;
    SEL.HOLDER.porteur.data.civilite =      SEL.objects.userSig.prefix;
    SEL.HOLDER.porteur.data.nom =           SEL.objects.userSig.lastname;
    SEL.HOLDER.porteur.data.prenom =        SEL.objects.userSig.firstname;
    SEL.HOLDER.porteur.data.dateNaissance = SEL.objects.userSig.birthDate.year + "-" + SEL.objects.userSig.birthDate.month + "-" + SEL.objects.userSig.birthDate.day;
    SEL.HOLDER.porteur.data.birthDay =      SEL.objects.userSig.birthDate.day;
    SEL.HOLDER.porteur.data.birthMonth =    SEL.objects.userSig.birthDate.month;
    SEL.HOLDER.porteur.data.birthYear =     SEL.objects.userSig.birthDate.year;


    SEL.HOLDER.porteur.data.ligne3 =             SEL.objects.userSig.street3;
    SEL.HOLDER.porteur.data.ligne2 =             SEL.objects.userSig.street2;
    SEL.HOLDER.porteur.data.codePostal =         SEL.objects.userSig.postalCode;

    SEL.HOLDER.porteur.data.bureauDistributeur = SEL.objects.userSig.city.bureauDistributeur || "";
    SEL.HOLDER.porteur.data.codeInseeCommune =   SEL.objects.userSig.city.codeInseeCommune || "";
    SEL.HOLDER.porteur.data.codePostal =         SEL.objects.userSig.city.codePostal;
    SEL.HOLDER.porteur.data.label =              SEL.objects.userSig.city.label || "";
    SEL.HOLDER.porteur.data.libelle =            SEL.objects.userSig.city.libelle || "";

    SEL.HOLDER.porteur.data.pays =               SEL.objects.userSig.country;
    SEL.HOLDER.porteur.data.city =               SEL.objects.userSig.city.libelle || "";

    SEL.HOLDER.porteur.data.telephoneMobile =        SEL.objects.userSig.mobile;
    SEL.HOLDER.porteur.data.telephoneFixe =          SEL.objects.userSig.phone;
    SEL.HOLDER.porteur.data.telephoneProfessionnel = SEL.objects.userSig.office;
    SEL.HOLDER.porteur.data.eMail =                  SEL.objects.userSel.email;

    SEL.HOLDER.porteur.data.donneesCommunicables =              SEL.objects.userSig.acceptContract;
    SEL.HOLDER.porteur.data.sollicitationAutresProduits =       SEL.objects.userSig.acceptPromotion;
    SEL.HOLDER.porteur.data.regroupementPrelevements =          SEL.objects.userSig.groupPay;
    SEL.HOLDER.porteur.data.codeCategorieSocioProfessionnelle = SEL.objects.userSig.socialGroup;
    SEL.HOLDER.porteur.data.libelleEtat =                       SEL.objects.userSig.stateLabel;

    SEL.HOLDER.porteur.data.reference = SEL.objects.userSig.reference;


    SEL.HOLDER.porteur.data.photoValid =  SEL.objects.cart.documents.photoValid;

    SEL.HOLDER.porteur.data.bic =  SEL.objects.userSig.bic;
    SEL.HOLDER.porteur.data.iban = SEL.objects.userSig.iban;
    SEL.HOLDER.porteur.data.ibanTab = SEL.objects.userSig.ibanTab;
    SEL.HOLDER.porteur.data.rum = SEL.objects.userSig.rum;
    SEL.HOLDER.profil.customerId = SEL.objects.userSig.customerId;
    SEL.HOLDER.profil.contractId = SEL.objects.userSig.contractId;

    SEL.HOLDER.porteur.data.photoUrl =  SEL.objects.cart.documents.url_photo;

};

SEL.loadHolderInObjects = function() {
    SEL.objects.userSig = {
        "isNew":        SEL.HOLDER.porteur.data.isNew,
        "isNotPayer":   SEL.HOLDER.porteur.data.isNotPayer,
        "prefix":       SEL.HOLDER.porteur.data.civilite,
        "lastname":     SEL.HOLDER.porteur.data.nom,
        "firstname":    SEL.HOLDER.porteur.data.prenom,
        "birthDate": {
            "day":      SEL.HOLDER.porteur.data.dateNaissance ? SEL.HOLDER.porteur.data.dateNaissance.split('-')[2].split('T')[0] : "",
            "month":    SEL.HOLDER.porteur.data.dateNaissance ? SEL.HOLDER.porteur.data.dateNaissance.split('-')[1] : "",
            "year":     SEL.HOLDER.porteur.data.dateNaissance ? SEL.HOLDER.porteur.data.dateNaissance.split('-')[0] : ""
        },
        "street3": SEL.HOLDER.porteur.data.ligne3,
        "street2": SEL.HOLDER.porteur.data.ligne2,
        "postalCode": SEL.HOLDER.porteur.data.codePostal || null,

        "city": {
            "bureauDistributeur": SEL.HOLDER.porteur.data.bureauDistributeur || "",
            "codeInseeCommune":   SEL.HOLDER.porteur.data.codeInseeCommune || "",
            "codePostal":         SEL.HOLDER.porteur.data.codePostal || "",
            "label":              SEL.HOLDER.porteur.data.bureauDistributeur || "",
            "libelle":            SEL.HOLDER.porteur.data.bureauDistributeur || ""
        },
        "country":                SEL.HOLDER.porteur.data.pays || "France",
        "mobile":                 SEL.HOLDER.porteur.data.telephoneMobile,
        "phone":                  SEL.HOLDER.porteur.data.telephoneFixe,
        "office":                 SEL.HOLDER.porteur.data.telephoneProfessionnel,
        "email":                  SEL.HOLDER.porteur.data.eMail,

        "acceptContract":         SEL.HOLDER.porteur.data.donneesCommunicables,
        "acceptPromotion":        SEL.HOLDER.porteur.data.sollicitationAutresProduits,
        "groupPay":               SEL.HOLDER.porteur.data.regroupementPrelevements,
        "socialGroup":            SEL.HOLDER.porteur.data.codeCategorieSocioProfessionnelle || 1,
        "stateLabel":             SEL.HOLDER.porteur.data.libelleEtat,

        "reference": SEL.HOLDER.porteur.data.reference || null,
        "photoValid":SEL.HOLDER.porteur.data.photoValid,

        "bic": SEL.HOLDER.porteur.data.bic,
        "iban": SEL.HOLDER.porteur.data.iban,
        "ibanTab": SEL.HOLDER.porteur.data.ibanTab,

        "rum": SEL.HOLDER.porteur.data.rum,
        "customerId": SEL.HOLDER.profil.customerId,
        "contractId": SEL.HOLDER.profil.contractId
    };
    //SEL.HOLDER.porteur.data.photoUrl =  SEL.objects.cart.documents.url_photo;

    SEL.objects.userSel.email = SEL.HOLDER.porteur.data.eMail;
}

SEL.objects = {
    "step": {
        "profil": {
            "formState": {
                "error": null,
                "submitted": null,
                "valid": null
            },
            "stepState":{
                "hasBeenReached": false
            }
        },
        "identification": {
            "userSigCollection": []
        },
        "forfait" : {
            "formState": {
                "error": null,
                "submitted": null,
                "valid": null
            },
            "stepState":{
                "hasBeenReached": false
            }
        },
        "porteur" : {
            "formState": {
                "error": null,
                "submitted": null,
                "valid": null
            },
            "stepState":{
                "hasBeenReached": false
            }
        },
        "photo" : {
            "formState": {
                "error": null,
                "submitted": null,
                "valid": null
            },
            "stepState":{
                "hasBeenReached": false
            }
        },
        "paiement" : {
            "formState": {
                "error": null,
                "submitted": null,
                "valid": null
            },
            "stepState":{
                "hasBeenReached": false
            }
        },
        "recapitulatif" : {
            "formState": {
                "error": null,
                "submitted": null,
                "valid": null
            },
            "stepState":{
                "hasBeenReached": false
            }
        }

    },
    "cart": {
        "cartId": false,
        "orderId": null,
        "options": null,
        "optionsId":null,
        "model1_date_forfait": null,
        "model1_zone": null,
        "zoneForfaitDetail": null,
        "documents": {
        	"url_pdf": null,
        	"url_signed_pdf":null,
        	"url_png": null,
        	"url_signed_png":null,
        	"sepa":{
            	"url_pdf": null,
            	"url_signed_pdf":null,
            	"url_png": null,
            	"url_signed_png":null
        	},
        	"url_photo":null,
        	"otp":null,
        	"otpMethod":null,
        	"token": null
        }
    },
    "userSig": {
        "isNew": false,
        "isNotPayer": false,
        "prefix":    null,
        "title":    null,
        "lastname":  null,
        "firstname": null,
        "birthDate": {
            "day":   null,
            "month": null,
            "year":  null
        },
        "street3": null,
        "street2": null,
        "postalCode": null,
        "city": {
            "bureauDistributeur": "",
            "codeInseeCommune":   "",
            "codePostal":         "",
            "label":              "",
            "libelle":            ""
        },
        "country": "France",
        "NPAI": null,
        "mobile": null,
        "phone": null,
        "office": null,
        "email": null,
        "emailTwin": null,
        "acceptContract": null,
        "acceptPromotion": null,
        "groupPay": null,
        "socialGroup": null,
        "stateLabel": null,
        "reference": null,
        "photoValid":null,
        "photoOriginal":null,
        "bic": null,
        "iban": null,
        "rum": null,
        "ibanTab": [null, null, null, null, null, null, null],
        "IbanIsValid": false,
        "customerId": null,
        "contractId": null
    },
    "payerSig": {
        "isNew": false,
        "prefix": null,
        "title": null,
        "lastname": null,
        "firstname": null,
        "birthDate": {
            "day":   null,
            "month": null,
            "year":  null
        },
        "street3": null,
        "street2": null,
        "postalCode": null,
        "city": {
            "bureauDistributeur": "",
            "codeInseeCommune":  "",
            "codePostal":        "",
            "label":             "",
            "libelle":           ""
        },
        "country": "France",
        "NPAI": null,
        "mobile": null,
        "phone": null,
        "office": null,
        "email": null,
        "emailTwin": null,
        "acceptContract": null,
        "acceptPromotion": null,
        "groupPay": null,
        "socialGroup": null,
        "stateLabel": null,
        "reference": null,
        "photoValid":null,
        "photoOriginal":null,
        "bic": null,
        "iban": null,
        "rum": null,
        "ibanTab": [null, null, null, null, null, null, null],
        "IbanIsValid": false,
        "customerId": null,
        "contractId": null
    },
    "userInfo": {
        "userPristine": false,
        "isNewInSIG" : false,
        "hasCard":null,
        "isUserSel": null,
        "isSig": false,
        "isConnected":false
    },
    "userSel": {
        "email": null,
        "emailTwin": null,
        "password": "",
        "passwordTwin": ""
    },
    "payerSel": {
        "email": null,
        "emailTwin": null,
        "password": "",
        "passwordTwin": ""
    }
};
