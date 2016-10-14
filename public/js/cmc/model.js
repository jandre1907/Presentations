/**
 * Protect window.console method calls, e.g. console is not defined on IE
 * unless dev tools are open, and IE doesn't define console.debug
 */
(function() {
    // Union of Chrome, Firefox, IE, Opera, and Safari console methods
    var methods = ["assert", "assert", "cd", "clear", "count", "countReset",
        "debug", "dir", "dirxml", "dirxml", "dirxml", "error", "error", "exception",
        "group", "group", "groupCollapsed", "groupCollapsed", "groupEnd", "info",
        "info", "log", "log", "markTimeline", "profile", "profileEnd", "profileEnd",
        "select", "table", "table", "time", "time", "timeEnd", "timeEnd", "timeEnd",
        "timeEnd", "timeEnd", "timeStamp", "timeline", "timelineEnd", "trace",
        "trace", "trace", "trace", "trace", "warn"];
    var length = methods.length;
    var console = (window.console = window.console || {});
    var method;
    var noop = function() {};
    while (length--) {
        method = methods[length];
        // define undefined methods as noops to prevent errors
        if (!console[method])
            console[method] = noop;
    }
})();
/*****************************************************
 *  Uniq Commande de carte :
 *****************************************************/
window.CMC = typeof CMC == "undefined" ? {} : CMC;

CMC.provider = {};

CMC.lang = "fr";

CMC.log = function (params) {
    if (console && console.log) {
        console.log(params);
    }
};

CMC.initArray = function (start, end) {
    var res = [];
    for (var i = start; i <= end; i++) {
        res.push(i < 10 ? "0" + i : "" + i);
    }
    ;
    return res;
}

CMC.Controllers = function () {
};

CMC.Model = function () {
};

CMC.extending = function (obj) {
    var temp = function () {
    };
    temp.prototype = obj;

    return new temp();
};

CMC.Model.prototype.saveForm = function (key, data, $cookieStore) {
    savingData = {};
    switch (key) {
        default :
            savingData = data;
    }

    try {
        $cookieStore.put(key, savingData);
    } catch (e) {
        CMC.log(e);
    }
};

CMC.Model.prototype.loadForm = function (key, $cookieStore) {
    try {
        return $cookieStore.get(key);
    } catch (e) {
        CMC.log(e);
    }
    var defaultRes = {};
    return defaultRes;
};

CMC.routes = {
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
    "validateOrder": {
        "url": "api/validate/order.json",
        "method": "GET"
    },
    "saisirOrange": {
        "url": "api/sig/SaisirOrange.json",
        "method": "POST"
    },
    "createOrUpdateCardOrder": {
        "url": "api/CreateOrUpdateCardOrder.json",
        "method": "POST"
    },
    "updateFullUserSel": {
        "url": "api/updateUserSelFull.json",
        "method": "POST"
    },
    "photoFileUpload": {
        "url": "api/sig/file/uploads.json",
        "method": "GET"
    },
    "getPhotoClient": {
        "url": "api/sig/photo/by/client/number.json",
        "method": "GET"
    },
    "stepLoadx" : {
        "url": "api/step/loadx.json",
        "method": "POST"
    },
    "stepSubmitx" : {
        "url": "api/step/submitx.json",
        "method": "POST"
    }
};

CMC.Model.prototype.Titles = function (lang) {
    var msg = {
        "fr" : {
            "Profil":         "Client Existant ?",
            "Porteur":        "Vos coordonnées 2",
            "Photo":          "Photo",
            "Recapitulatif":  "Récapitulatif",
            "Confirmation":   "Confirmation",
            "Identification": "Identification",
            "Detail": "Rattachement Données complémentaires",
            "Forfait": "Rattachement - Cas Payeur - Séléction du forfait",
            "Service": "Contacter service client",
            "Dedi": "Rattachement non autorisé",

            "end": ""
            //
        }
    };

    return msg[lang];
};

CMC.Model.prototype.Sender = function($http) {
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
        CMC.log('http get');
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
        CMC.log('http get');
        $http
            .get(url, param, options)
            .success(success)
            .error(error);
    };

    var httpPost = function(url, param, success, error, options) {
        CMC.log('http post');
        $http
            .post(url, param, options)
            .success(success)
            .error(error);
    };

    var httpPut = function(url, param, success, error, options) {
        CMC.log('http put');
        $http
            .put(url,param,options)
            .success(success)
            .error(error);
    };
}

CMC.Model.prototype.saveScopedObject =  function(currentObject) {

};

CMC.Model.prototype.getScopedObject =  function(currentObject) {
    //TODO in cookies

};

CMC.Model.prototype.saveStep = function(currentObject) {
    //TODO in cookies
    currentObject = currentObject || {};
    for(key in CMC.objects) {
        CMC.objects[key] = currentObject[key];
    }

    return currentObject;
};

CMC.Model.prototype.loadStep = function(currentObject) {
    currentObject = currentObject || {};
    for (key in CMC.objects){
        currentObject[key] = CMC.objects[key];
    }

    return currentObject;
};

CMC.Model.prototype.gotoPage = function(page) {
    window.location.path = page;
};

CMC.objects = {
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
        }

    },
    "userSig": {
        "isNew": null,
        "prefix": null,
        "lastname": null,
        "firstname": null,
        "birthDate": {
            "day": null,
            "month": null,
            "year": null
        },
        "street3": null,
        "street2": null,
        "postalCode": null,
        "city": null,
        "country": "France",
        "NPAI": null,
        "mobile": null,
        "phone": null,
        "office": null,
        "email": null,
        "acceptContract": null,
        "acceptPromotion": null,
        "groupPay": null,
        "socialGroup": null,
        "stateLabel": null,
        "reference": null,
        "photoValid":null,
        "photoOriginal":null
    },
    "userInfo": {
        "userPristine": false,
        "isNewInSIG" : false,
        "hasCard":null,
        "isUserSel": null,
        "isSig": false,
        "cardOrderId": null,
        "refContratSig":null,
        "increment_id":null   // parametre recu depuis retour API Magento - processOrder :  api/form/process/order.json -
                              // passé a la methode API Magento - validateOrder - :         api/validate/order.json
                              // fichier js/cmc/recapitulatifCtrl.js - ligne 74
     },
    "userSel": {
        "email": null,
        "emailTwin": null,
        "password": null,
        "passwordTwin": null
    },
    "jourDeValidation":5
};

CMC.initArray = function(start, end) {
    var res = [];
    for (var i = start; i <= end; i++) {
        res.push(i < 10 ? "0" + i : "" + i);
    };

    return res;
}

CMC.fillBirthDate = function($scope){
    $scope.days   = CMC.initArray(1,31);
    $scope.months = CMC.initArray(1,12);
    $scope.years  = CMC.initArray(1890 , 1900 + (new Date()).getYear());

    return $scope;
};

CMC.overwriteObject = function (news, olds, option) {
    news = news || {};
    olds = olds || {};
    if (typeof option == undefined) {
        for(var key in olds) {
            olds[key] = olds[key] || news[key];
        }
    };

    for(var key in news) {
        olds[key] = news[key];
    }
    return olds;
}

CMC.contracts = {
    "contrats":{
        "ModePaiement": {
            1: "Prélevement",
            2: "Comptant"
        },
        "CodeProduit":{
            1:{
                "Name": "Imagine R scolaire",
                "CodeEtat":{
                    0: "Inexistant",
                    1: "Incomplet",
                    2: "Abandonné",
                    3: "Actif",
                    4: "Impayé",
                    5: "Retard",
                    6: "Suspendu",
                    7: "Résilié client",
                    8: "Résilié COMUTITRES",
                    9: "Résilié gestionnaire",
                    10: "Résilié transporteur",
                    11: "Cloturé",
                    12: "Appel sortant à faire",
                    13: "Non joignable",
                    14: "Client à dédoublonner",
                    15: "Attente photo",
                    16: "A éditer",
                    17: "Email à faire",
                    18: "Attente paiement GRC",
                    19: "Abandon confirmé",
                    20: "Contentieux"
                }
            },
            2:{
                "Name": "Imagine R étudiant",
                "CodeEtat": {
                    0: "Inexistant",
                    1: "Incomplet",
                    2: "Abandonné",
                    3: "Actif",
                    4: "Impayé",
                    5: "Retard",
                    6: "Suspendu",
                    7: "Résilié client",
                    8: "Résilié COMUTITRES",
                    9: "Résilié gestionnaire",
                    10: "Résilié transporteur",
                    11: "Cloturé",
                    12: "Appel sortant à faire",
                    13: "Non joignable",
                    14: "Client à dédoublonner",
                    15: "Attente photo",
                    16: "A éditer",
                    17: "Email à faire",
                    18: "Attente paiement GRC",
                    19: "Abandon confirmé",
                    20: "Contentieux",
                    23: "TRAITEMENT BACK OFFICE"
                }
            },
            3: {
                "Name": "Navigo Mois Semaine",
                "CodeEtat":{
                    0: "Inexistant",
                    1: "Incomplet",
                    2: "Abandonné",
                    3: "Actif",
                    4: "Impayé",
                    5: "Retard",
                    6: "Suspendu",
                    7: "Résilié payeur",
                    8: "Résilié COMUTITRES",
                    9: "Résilié gestionnaire",
                    10: "Résilié transporteur",
                    11: "Cloturé",
                    12: "Appel sortant à faire",
                    13: "Non joignable",
                    14: "Client à dédoublonner",
                    15: "Attente photo",
                    16: "A éditer",
                    17: "Email à faire",
                    18: "Attente paiement GRC",
                    21: "absence SIRET a valider"
                }
            },
            4 : {
                "Name": "Navigo Annuel",
                "CodeEtat": {
                    0: "Inexistant",
                    1: "Incomplet",
                    2: "Abandonné",
                    3: "Actif",
                    4: "Impayé",
                    5: "Retard",
                    6: "Suspendu",
                    7: "Résilié payeur",
                    8: "Résilié COMUTITRES",
                    9: "Résilié gestionnaire",
                    10: "Résilié transporteur",
                    11: "Cloturé",
                    12: "Appel sortant à faire",
                    13: "Non joignable",
                    14: "Client à dédoublonner",
                    15: "Attente photo",
                    16: "A éditer",
                    17: "Email à faire",
                    18: "Attente paiement GRC"
                }
            }
        }
    }
};