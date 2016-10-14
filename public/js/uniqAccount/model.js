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
 *  Uniq Account
 *****************************************************/

window.CX = typeof CX == "undefined" ? {} : CX;

CX.lang = "fr";

CX.log = function (params) {
    if (false // set to true in dev mod
        && window.console
        && window.console.log
    ) {
        console.log(params);
    }
};

CX.initArray = function (start, end) {
    var res = [];
    for (var i = start; i <= end; i++) {
        res.push(i < 10 ? "0" + i : "" + i);
    }
    return res;
};

CX.Controllers = function () {
};

CX.Model = function () {
};

//-----------------------
// searchUserSigModel
// Objet pour contenir les ref de plusieur UserSIg Payeur

CX.searchUserSigModel = {

    userSigCollec:[], // tableau de réponse -
    isUpdate:false, // passe a true si l'user est passé par l'étape détail -
                    // dés lors, lorsqu'il choisi le compte a lier il faut faire un update
                    // (un compte UserSel est créée a l'étape formulaire !)
    referenceUnknown:true,
    email:"",
    birthDate_day:"",
    birthDate_month:"",
    birthDate_year:"",
    captchaResponse:"",
    password:"",
    //------------------------
    // Methodes :
    isMultiUserSig: function(){
        if(this.userSigCollec.length > 1){
            return true;
        }
        else {
            return false;
        }
    }

};
//

CX.extending = function (obj) {
    var temp = function () {
    };
    temp.prototype = obj;

    return new temp();
};


/*CX.Model.prototype.Customer = function() {
 this.sigSaved;
 this.password;
 this.photoUrl;
 this.sigParams = {};

 this.civilStatus = {
 "reference":  null,
 "birthdate":  "01-01-1970",
 "prefix":     null,
 "firstname":  null,
 "lastname":   null,
 "email":      null,
 "phone":      null,
 "mobil":      null,
 "address" : {
 "street":     null,
 "street2":    null,
 "postalCode": null,
 "city":       null,
 "country":    "France"
 }
 };

 this.getAll = function() {
 return this;
 };

 this.update = function(updatedCustomer) {
 for(key in updatedCustomer) {
 this[key] = updatedCustomer[key];
 }
 };

 this.updateField = function(updateFieldKey, updateFieldValue) {
 this[updateFieldKey] = updateFieldValue;
 };

 this.isSigSaved = function(itIs) {
 if (itIs) {
 this.sigSaved = itIs;
 }

 return this.sigSaved;
 };

 };
 */
CX.Model.prototype.Step = function () {
    this.steps = {}
};

CX.routes = {
    "searchUserAndSave": {
        "url": window.PREFIX_FRONT + "api/sig/search/client/and/save.json",
        "method": "POST"
    },
    "createUserSel": {
        "url": window.PREFIX_FRONT + "api/createUserSel.json",
        "method": "POST"
    },
    "renewConfirmationEmail": {
        "url": window.PREFIX_FRONT + "api/renewConfirmationEmail.json",
        "method": "POST"
    },
    "isUserSel": {
        "url": window.PREFIX_FRONT + "api/isUser.json",
        "method": "GET"
    },
    "getUserSel": {
        "url": window.PREFIX_FRONT + "api/getUser.json",
        "method": "GET"
    },
    "updateUserSel": {
        "url": window.PREFIX_FRONT + "api/update/user/sel.json",
        "method": "POST"
    },
    "searchUserSig": {
        //"url": window.PREFIX_FRONT + "api/sig/searchClientSig.json",
        "url": window.PREFIX_FRONT + "rest/sig/searchClientAccountSig.json",
        "method": "GET"
    },
    "getUserSigByReference": {
        "url": window.PREFIX_FRONT + "rest/sig/clientbynumber.json",
        "method": "GET"
    },
    "getCities": {
        "url": window.PREFIX_FRONT + "rest/sig/cities/postal/code.json",
        "method": "GET"
    },
    "updateUserAddressSel": {
        "url": window.PREFIX_FRONT + "api/updateUserAddressSel.json",
        "method": "POST"
    },
    "updateUserSel": {
        "url": window.PREFIX_FRONT + "api/updateUserSel.json",
        "method": "POST"
    }
};

CX.Model.prototype.Titles = function (lang) {
    var msg = {
        "fr": {
            "saisie_donnees_client": "Création de votre espace personnel",
            "donnees_complementaires": "Création de votre espace personnel",
            "confirmation_creation_espace": "Création de votre espace personnel",
            "echec_identification": "Création de votre espace personnel",//script
            "demande_interdite": "Création de votre espace personnel",//script
            "verification_coordonnees": "Vos coordonnées",
            "lien_activation_expire": "Problème d'activation de votre espace personnel",

            "end": ""
            //
        }
    };

    return msg[lang];
};
CX.Model.prototype.Messages = function (lang) {
    var msg = {
        "fr": {
            "SNA-CO-EC01-MSS_001": "Votre téléphone portable nous servira à finaliser votre souscription. Il ne sera en aucun cas utilisé à des fins commerciales sans votre autorisation.",
            "SNA-CO-EC01-MSS_002": "Votre email et votre mot de passe seront vos identifiants pour accéder à votre compte Services Navigo personnalisé.",
            "SNA-CO-EC01-ERR_003": "Vous disposez déjà d’un forfait annuel à votre nom. Vous ne pouvez pas souscrire un 2e forfait.",
            "SNA-CO-EC01-MSS_004": "Un courrier envoyé à cette adresse n’a pas pu vous être remis. Veuillez mettre à jour votre adresse postale.",
            "SNA-CO-EC01-MSS_005": "Veuillez-ressaisir votre code postal ou saisir la commune",
            "SNA-CO-EC01-ERR_006": "L'âge minimum pour souscrire à un forfait Navigo Annuel est de 4 ans.",
            "SNA-CO-EC01-ERR_007": "Erreur dans la saisie de la date de naissance. Merci de la saisir à nouveau.",
            "SNA-CO-EC01-ERR_008": "Nous ne sommes pas en mesure de donner suite à votre demande.",


            "SNA-PAI-EC01-MSS_001": "Le numéro de téléphone portable du payeur nous servira à finaliser la souscription.",
            "SNA-PAI-EC01-MSS_002": "Ces informations sont disponibles sur votre RIB.",
            "SNA-PAI-EC01-ERR_003": "Le code banque de votre RIB n’est pas reconnu. Merci de saisir un nouveau BIC / IBAN associé à un compte bancaire domicilié en France,  DROM-COM inclus (hors compte épargne).",
            "SNA-PAI-EC01-ERR_004": "L'IBAN et le BIC saisis ne sont pas valides. Veuillez les saisir à nouveau.",
            "SNA-PAI-EC01-ERR_005": "Le payeur désigné finance déjà un forfait présentant une dette. Merci de la régulariser avant de souscrire  un nouveau forfait.",
            "SNA-PAI-EC01-ERR_006": "L’âge minimum pour souscrire à un forfait Navigo Annuel est de 4 ans. Les enfants de moins de 4 ans voyagent gratuitement.",
            "SNA-PAI-EC01-ERR_007": "Erreur de saisie dans la date de naissance. Merci de la saisir à nouveau.",
            "SNA-PAI-EC01-ERR_008": "Nous ne sommes pas en mesure de donner suite à votre demande. Nous vous remercions de bien vouloir vous rapprocher de l’Agence Navigo Annuel au 09 63 39 22 22.",

            "SNA-SIG-EC01-MSS_001": "Vous ne pouvez pas redemander l’envoi d’un code de signature par SMS. Vous pouvez demander l’envoi d’un code par email.",
            "SNA-SIG-EC01-MSS_002": "Un code de signature vous a déjà été transmis par email à l’adresse [mail du signataire].",
            "SNA-SIG-EC01-MSS_003": "Vous allez maintenant signer électroniquement votre contrat Navigo Annuel. Pour cela vous devez accepter les conditions générales d’utilisation et de vente du forfait et renseigner un code de validation.<br/>Votre dossier ne sera transmis qu’après la finalisation de l’étape de signature électronique.",
            "SNA-SIG-EC01-MSS_004": "%s a demandé à souscrire un forfait navigo Annuel pour lequel vous êtes déclaré comme payeur.<br/>Les caractéristiques du forfait sont :<br/>Date de début du forfait    %S<br/>Zones du forfait                   %s<br/>Montant                                %s<br/>Vous allez procéder maintenant à la signature électronique du contrat Navigo Annuel et de votre mandat de prélèvement.<br/>Veuillez-noter que votre dossier ne sera transmis qu’après la finalisation de l’étape de signature électronique.",
            "SNA-SIG-EC01-MSS_005": "Vous allez procéder maintenant à la signature électronique de votre contrat Navigo Annuel.<br/>Veuillez-noter que votre dossier ne sera transmis qu’après la finalisation de l’étape de signature électronique.",
            "SNA-SIG-EC01-MSS_006": "Un code vous a été envoyé par sms. Si vous ne l'avez pas reçu dans 5 minutes, vous pouvez en demander un autre par e-mail à l'adresse %s.<br />Attention, l’envoi du code par e-mail désactive le code envoyé par SMS.",
            "SNA-SIG-EC01-MSS_007": "Un code vous a été envoyé par e-mail.<br />Il restera valide durant 15 minutes à compter de sa réception.",
            "SNA-SIG-EC01-MSS_008": "Nous vous avons envoyé un SMS. Si vous ne l’avez pas reçu après 5 minutes, vous pouvez demander à recevoir un autre code par email à l’adresse %s. Attention, le code envoyé par SMS ne sera plus valable",
            "SNA-SIG-EC01-ERR_003": "Le code de signature saisi est incorrect, veuillez le saisir à nouveau.",
            "SNA-SIG-EC01-ERR_004": "Le code de signature saisi est incorrect et il a été verrouillé. Vous devez attendre 24h pour réessayer. Vous pourrez alors recommencer votre processus de signature électronique ou souscrire à imagine R grâce au formulaire papier.",


            "SNA-RAT-EC02-ERR_001": "L'âge minimum pour souscrire à un forfait Navigo Annuel est de 4 ans.",
            "SNA-RAT-EC02-ERR_002": "Erreur dans la saisie de la date de naissance. Merci de la saisir à nouveau.",

            "SNA-FOR-EC01-MSS_001": "Votre choix n’est pas disponible pour la souscription en ligne. Pour en bénéficier rendez-vous en point de vente.",


            "IHM-TRANS-ERR_001": "Informations obligatoires.",
            "IHM-TRANS-ERR_002": "Information incorrecte, veuillez les saisir à nouveau.",
            "IHM-TRANS-ERR_002_PLURIEL": "Informations incorrectes, veuillez les saisir à nouveau.",
            "IHM-TRANS-ERR_003": "Mot de passe incorrecte, veuillez le saisir à nouveau.",
            "IHM-TRANS-ERR_004": "L'adresse email saisie est invalide. Veuillez la saisir à nouveau.",
            "IHM-TRANS-ERR_005": "Les deux mots de passe ne concordent pas. Veuillez les saisir à nouveau.",
            "IHM-TRANS-ERR_006": "Les deux adresses email ne concordent pas. Veuillez les saisir à nouveau.",

            "CU-INS-EC01-ERR_001": "Cette adresse email est déjà liée à un espace client. Veuillez en saisir une autre ou vous connecter à votre espace actuel.",
            "CU-INS-EC02-ERR_001": "Trois mails d’activation vous ont déjà été envoyés. Merci de créer un nouvel espace client. ",
            "CU-INS-EC02-ERR_002": "Votre espace client a bien été créé.",
            "CU-INS-EC02-MSG_002": "Votre espace client a bien été créé.", // ?????
            "CU-INS-EC02-ERR_003": "Votre espace a déjà été activé. Merci d’utiliser vos identifiants pour y accéder.",
            "CU-INS-EC02-ERR_004": "Votre lien d’activation n’est plus valide. Veuillez recommencer le processus de création de votre espace.",

            "CU-INS-EC03-MSS_001": "Un courrier envoyé à cette adresse n’a pas pu vous être remis. Veuillez mettre à jour votre adresse postale. ",
            "CU-INS-EC03-MSS_002": "Nous vous recommandons de renseigner un numéro de téléphone portable car celui-ci vous sera nécessaire lors de vos futures souscriptions.",

            "CU-RAT-EC01-MSS_001": "Nous ne sommes pas parvenus à retrouver vos informations client à partir des données que vous nous avez fournies.Nous vous invitons à contacter le service client au n° 09 69 39 57 57.",
            "CU-RAT-EC01-MSS_002": "Nous ne sommes pas en mesure de donner suite à votre demande.",

            "CU-CON-EC01-ERR_001": "Données de connexion incorrectes.",
            "CU-CON-EC01-ERR_002": "Votre compte est bloqué. Un email vous a été envoyé pour modifier votre mot de passe.",
            "CU-CON-EC01-ERR_003": "Votre compte n’est pas encore activé. Un mail d’activation vous avait été adressé pour l’activation de votre compte.",
            "CU-CON-EC01-ERR_004": "Votre mot de passe est incorrect. Veuillez recommencer. <br/>Il vous reste %s tentatives.",
            "CU-CON-EC01-ERR_005": "Vous avez été déconnecté suite à une trop longue inactivité sur notre site.",
            "CU-CON-EC01-ERR_006": "Nous ne sommes pas parvenus à retrouver vos informations client à partir des données que vous nous avez fournies.<br/>Nous vous invitons à contacter le service client au n° <b>09 69 39 57 57</b>.",

            "CU-REI-EC03-MSS_001": "Votre nouveau mot de passe a bien été enregistré.",
            "CU-REI-EC03-MSS_002": "Votre nouveau mot de passe a bien été enregistré. Nous vous confirmons le déblocage de votre compte.",

            "CU-CON-EC04-ERR_001": "Nous vous invitons à contacter le service client au 09 69 39 57 57 (coùt d'un appel local non surtaxé) du lundi au vendredi de 8h à 20h, le samedi de 9h à 20h, fermé le dimanche.",


            "end": ""
            //
        }
    };

    return msg[lang];
};

CX.Model.prototype.dateValid = function (clientDay, clientMonth, clientYear) {
    var date = new Date();
    var dateMonth = date.getMonth();
    var dateYear = date.getFullYear();
    var dateDay = date.getDay();

    var controlDate = new Date(clientYear + '-' + clientMonth + '-' + clientDay);
    var cYear = controlDate.getFullYear();
    var cMonth = controlDate.getMonth() + 1;
    var cDay = controlDate.getDate();

    var age = dateYear - clientYear;
    var bissextile = false;
    var dateInfos = {
        typeIsValid: "true",
        fevrier: "true",
        ageIsValid: "true",
        toYoung: "false",
        ndDayPerMonthIsValid: "true"
    };

    //**************controle type donnéess utilisateur*********
    if (cYear == clientYear && cMonth == clientMonth && cDay == clientDay) {

        //********nombre de mois && nombre d'années***************
        ndDayForMonth = (new Date(Date.parse(((clientMonth % 12) + 1).toString() + "/01/" + clientYear) - 86400000)).getDate();
        if (clientDay > ndDayForMonth) {
            dateInfos.ndDayPerMonthIsValid = "false";
        }

        //************controle de l'age****************************
        if (age > 200) {
            dateInfos.ageIsValid = "false";
        } else if (age < 4) {
            dateInfos.toYoung = "true";
        }
    } else {
        dateInfos.typeIsValid = "false";
    };

    return dateInfos;
};

CX.Model.prototype.httpGet = function (url, param, success, error, options) {
    CX.log('httpSend');
    CX.$http
        .get(url,
        {
            "params": param,
            "responseType": "json"
        }
        , options
    )
        .success(success)
        .error(error);
};

CX.Model.prototype.httpPost = function (url, param, success, error, options) {
    CX.log('httpSend');
    CX.$http
        .post(url, param, options)
        .success(success)
        .error(error);
};

CX.Model.prototype.httpPut = function (url, param, success, error, options) {
    CX.log('httpSend');
    CX.$http
        .put(url,
        {"param": param},
        options
    )
        .success(success)
        .error(error);
};

CX.Model.prototype.send = function (method, url, param, success, error, options) {
    switch (method) {
        case 'GET':
            CX.MODEL.httpGet(url, param, success, error, options);
            break;
        case 'POST':
            CX.MODEL.httpPost(url, param, success, error, options);
            break;
        case 'PUT':
            CX.MODEL.httpPut(url, param, success, error, options);
            break;
        case 'DELETE':
            CX.MODEL.httpDelete(url, param, success, error, options);
            break;
        case 'PATCH':
            CX.MODEL.httpPatch(url, param, success, error, options);
            break;
        default:
            CX.MODEL.httpGet(url, param, success, error, options);
    }
};
