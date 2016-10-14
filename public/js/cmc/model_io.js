CMC.Transformers = {};
CMC.Parsers = {};
/*-----------abstract------------------------------------------------------------------------*/
{
    CMC.IO = function ($q, $sender, $rootScope, ServerProcessError) {

        this.createRequest = function (routeName, parameters, transformer, parser, parserError) {
            this.routeName = routeName;
            this.parameters = parameters;
            this.transformer = transformer;
            this.parser = parser;
            this.parserError = parserError;
        };

        this.execute = function (routeName, parameters, transformer, parser, parserError) {
            this.createRequest(routeName, parameters, transformer, parser, parserError);

            return this.executeRequest();
        }

        this.setRouteName = function (routeName, context) {
            context = context || this;
            context.routeName = routeName;
        };

        this.formatParameter = function (context) {
            context = context || this;
            if (context.transformer) {
                return context.transformer(context.parameters);
            }

            return CMC.Transformers.IOTransformer(context.parameters);
        };

        this.parseResponse = function (context) {
            context = context || this;
            if (context.parser) {
                return context.parser(context);
            }

            return CMC.Parsers.IOParser(context);
        };

        this.parseError = function (context) {
            context = context || this;
            if (context.errorParser) {
                return context.errorParser(context);
            }

            return CMC.Parsers.IOParserError(context);
        };

        this.serveurError = function (context, exceptionE) {
            context.defered.reject(exceptionE);
        };

        this.executeRequest = function () {

            $rootScope.$broadcast("sendRequest");
            try {
                var context = this;
                this.defered = $q.defer();
                $sender.send(
                    CMC.routes[this.routeName].method,
                    CMC.routes[this.routeName].url,
                    this.formatParameter(this),
                    function success(data, status, headers, config, statusText) {
                        CMC.log("send success");
                        $rootScope.$broadcast("receiveResponse");
                        var successCallback = function() {
                            return context.parseResponse(context)(data, status, headers, config, statusText);
                        };
                        var errorCallback = function(message) {
                            context.defered.reject(message);
                        };
                        ServerProcessError.manage(data, successCallback, errorCallback);

                    },
                    function error(data, status, headers, config, statusText) {
                        CMC.log("send fail");
                        $rootScope.$broadcast("receiveResponse");
                        context.parseError(context)(data, status, headers, config, statusText);
                    }
                );
            } catch (e) {

                $rootScope.$broadcast("receiveResponse");
                this.serveurError(this, e);

                return this.defered.promise;
            }

            return this.defered.promise;
        };
    }

    /********************************************************************/
    CMC.Transformers.IOTransformer = function (rawParameters) {
        return rawParameters;
    };

    CMC.Parsers.IOParser = function (context) {
        return function (data, status, headers, config, statusText) {
            if (data) {
                context.defered.resolve(data);
            } else {
                context.parseError(data, status, headers, config, statusText, context.defered);
            }
        };
    };

    CMC.Parsers.IOParserError = function (context) {
        return function (data, status, headers, config, statusText) {
            context.defered.reject(data);
        }
    };

}
/*-----------getUserCase------------------------------------------------------------------------------*/
CMC.Transformers.getUserCaseFromPorteur = function ($scope) {
    var res = {
        "reference": $scope.userSel.reference || "",
        "email": $scope.userSel.email || "",
        "hasCard": $scope.userInfo.hasCard || "",
        "newUser": $scope.userInfo.isNew || "",
        "codeProduit": $scope.codeProduit,
        "userSig": $scope.userSig,
        "userSel": $scope.userSel,
        "userInfo": $scope.userInfo,
    };
    return res;
}

CMC.Parsers.getUserCaseFromPorteur = function (context) {
    return function (data, status, headers, config, statusText) {
        if (data) {
            context.defered.resolve(
                {
                    "useCase":      data.atomCase.GET_CASE,
                    "reference":    data.atomCase.reference,
                    "NPAI":         data.atomCase.SIG_STATE.NPAI,
                    "email":        data.atomCase.email,
                    "raw":          data
                }
            );
        } else {
            context.parseError(data, status, headers, config, statusText, context.defered);
        }
    };
}

/*-----------searchUserAndSave------------------------------------------------------------------------*/
{
    CMC.Transformers.searchUserAndSaveSample = function ($scope, options) {

        var res = {
            "clientNumber": $scope.reference,
            "dateNaissance": $scope.birthDate,
            "prenom": null,
            "nom": null,
            "codePostal": null,
            "eMail": null,
            "codeProduit": null,
            "save": null,
            "update": null,
            "regroupementPrelevements": null,
            "telephoneProfessionnel": null,
            "telephoneFixe": null,
            "telephoneMobile": null,
            "codeCategorieSocioProfessionnelle": null,
            "reference": $scope.reference,
            "sollicitationAutresProduits": null,
            "bureauDistributeur": null,
            "donneesCommunicables": null,
            "ligne3": null,
            "ligne2": null,
            "ligne1": null,
            "codeInseeCommune": null,
            "pays": null,
            "ligne4": null,
            "dateEffet": null,
            "raisonSociale": null,
            "civilite": null,
            "referenceHebergeur": null,
            "iban": null,
            "bic": null,
            "titulaireDuCompte": null,
            "dateDebutValidite": null,
            "isNotPayeur": null,
            "clientReference": null,
            "debug": null
        };
        return res;
    };
}

// (lv)
/*-----------updateUserSig------------------------------------------------------------------------*/
{
    CMC.Transformers.updateUserSig = function ($scope, options) {
        /*console.log(":: reference " + $scope.userSig.reference);
        console.log(":: birthDate " + $scope.userSig.birthDate);
        console.log(":: email " +       $scope.userSel.email);
        console.log(":: Mobile " +       $scope.userSig.mobile);

        console.log(":: street 1 " +    $scope.userSig.street1);
        console.log(":: street 2 " +    $scope.userSig.street2);
        console.log(":: street 3 " +    $scope.userSig.street3);*/



        var res = {
            "dateNaissance": $scope.userSig.birthDate.year + "-" + $scope.userSig.birthDate.month + "-" + $scope.userSig.birthDate.day,
            "prenom": null,
            "nom": null,
            "codePostal": $scope.userSig.postalCode,
            "eMail": $scope.userSel.email,
            "codeProduit": null,
            "save": 0,
            "update": 1,
            "regroupementPrelevements": null,
            "telephoneProfessionnel": null,
            "telephoneFixe": $scope.userSig.phone,
            "telephoneMobile": $scope.userSig.mobile,
            "codeCategorieSocioProfessionnelle": null,
            "reference": $scope.userSig.reference,
            "sollicitationAutresProduits": null,
            "bureauDistributeur": $scope.userSig.city.bureauDistributeur,
            "donneesCommunicables": null,
            "ligne3": $scope.userSig.street3,
            "ligne2": $scope.userSig.street2,
            "ligne1": "",
            "codeInseeCommune":  $scope.userSig.city.codeInseeCommune,
            "pays": null,
            "ligne4": null,
            "dateEffet": moment().format("YYYY-MM-DD"),
            "raisonSociale": null,
            "civilite": null,
            "referenceHebergeur": null,
            "iban": null,
            "bic": null,
            "titulaireDuCompte": null,
            "dateDebutValidite": null,
            "isNotPayeur": null,
            "debug": null
        };
        return res;
    };
}


CMC.Parsers.updateUserSig = function (context) {
    return function (data, status, headers, config, statusText) {
        if (!data.resultatSaisieClient || !data.resultatSaisieClient.libelleEvenement || data.resultatSaisieClient.libelleEvenement != "Données clients modifiées") {
            context.parseError({"msg": "erreur serveur", "data": data});
            return;
        }

        if (data.resultatSaisieClient && data.resultatSaisieClient.libelleEvenement && data.resultatSaisieClient.libelleEvenement == "Données clients modifiées") {
            context.defered.resolve(data.resultatSaisieClient);
            // origin context.defered.resolve(data.resultatSaisieClient.referenceClient);
            return;
        }

        context.parseError({"msg": "erreur serveur", "data": data});
        return;
    }
};


/*----------createUserSel---------------------------------------------------------------------------*/
{
    CMC.Transformers.createUserSelFromInscription = function ($scope, options) {
        var res = {
            "fos_user_registration_form": {
                "email": $scope.email,
                "plainPassword": {
                    "first": $scope.password,
                    "second": $scope.password
                }
            },
            "recaptcha_challenge_field": CMC.secretCaptcha,
            "recaptcha_response_field": $scope.response,
            "reference": $scope.reference
        };

        return res;
    };
}
/*----------createFullUserSel---------------------------------------------------------------------------*/
{
    CMC.Transformers.createFullUserSel = function ($scope, options) {
        var res = {
            "civilite": $scope.userSig.prefix || "",
            "prenom": $scope.userSig.firstname || "",
            "nom": $scope.userSig.lastname || "",
            "telephoneMobile": $scope.userSig.mobile || "",
            "city": $scope.userSig.city.libelle || "",
            "ligne3": $scope.userSig.street3 || "",
            "ligne2": $scope.userSig.street2 || "",
            "codePostal": $scope.userSig.postalCode || "",
            "pays": $scope.userSig.country || "",

            "eMail": $scope.userSel.email || "",
            "password": $scope.userSel.password || "",

            "clientNumber": $scope.userSig.reference || ""
        };

        return res;
    };
}

/*----------pdateUserSelFull---------------------------------------------------------------------------*/
{
    CMC.Transformers.updateUserSelFull = function ($scope, options) {
        var res = {
            "prefix": $scope.userSig.prefix || "",
            "firstname": $scope.userSig.firstname || "",
            "lastname": $scope.userSig.lastname || "",
            "mobile": $scope.userSig.mobile || "",
            "city": $scope.userSig.city.libelle || "",
            "street3": $scope.userSig.street3 || "",
            "street2": $scope.userSig.street2 || "",
            "postalCode": $scope.userSig.postalCode || "",
            "country": $scope.userSig.country || "",

            "email": $scope.userSel.email || "",
            "password": $scope.userSel.password || "",

            "reference": $scope.userSig.reference || ""
        };

        return res;
    };
}

/*----------isUserSel---------------------------------------------------------------------------*/
{
    CMC.Transformers.isUserSelFromInscription = function ($scope, options) {
        var res = {
            "email": $scope.email
        };

        return res;
    };
}
/*----------getUserSel---------------------------------------------------------------------------*/
{
    CMC.Transformers.getUserSelFromInscription = function ($scope, options) {
        var res = {
            "email": $scope.userSel.email
        };
        return res;
    };

    CMC.Parsers.getUserSelFromInscription = function (context) {
        return function (data, status, headers, config, statusText) {
            context.defered.reject("cet utilisateur existe déjà");
        };
    };

    CMC.Parsers.errorGetUserSelFromInscription = function (context) {
        return function (data, status, headers, config, statusText) {
            context.defered.resolve(data);
        };
    };

}
/*--------getUserSigByReference-----------------------------------------------------------------------------*/
{
    CMC.Transformers.getUserSigByReferenceFromPorteur = function ($scope, options) {
        var res = {
            "clientNumber": $scope.userSel.reference
        };
        return res;
    };


    CMC.Parsers.getUserSigByReferenceFromPorteur = function (context) {
        return function (data, status, headers, config, statusText) {

            if (data.resultatClient && data.resultatClient.client) {
                var client = data.resultatClient.client;
                var userSig = {
                    "street3": client.adresse.ligne3 || '',
                    "street2": (client.adresse.ligne1 || '') + ' ' + (client.adresse.ligne2 || ''),
                    "street1": client.adresse.ligne1 || '',
                    "postalCode": client.adresse.codePostal || '',
                    "country": client.adresse.pays || '',
                    "NPAI": client.adresse.nPAI || '',
                    "city": client.adresse.bureauDistributeur || '',

                    "mobile": client.telephoneMobile || '',
                    "phone": client.telephoneFixe || '',
                    "email": client.eMail || '',

                    "prefix": client.civilite || '',
                    "lastname": client.nom || '',
                    "firstname": client.prenom || '',
                    "birthDate": client.dateNaissance || '',

                    "acceptCom": client.donneesCommunicables || '',
                    "stateLabel": client.libelleEtat || '',
                    "groupPay": client.regroupementPrelevements || '',
                    "acceptContract": client.sollicitationAutresProduits || ''
                };

                userSig = SEL.MODEL.overwriteObject(userSig, SEL.objects.userSig);

                d = new Date(userSig.birthDate);
                userSig.birthDate = {
                    "day": d.getDate() < 10 ? "0" + d.getDate() : "" + d.getDate(),
                    "month": d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : "" + (d.getMonth() + 1),
                    "year": "" + d.getFullYear()
                }

                var city = client.adresse;
                city.label = city.bureauDistributeur;
                city.libelle = city.label;

                userSig.city = city;


                context.defered.resolve(
                    {
                        "userSig": userSig,
                        "email": userSig.email,
                        "city": city
                    }
                );
            } else {
                var msg;
                context.parseError(data, status, headers, config, statusText, context.defered);
            }
        };
    };
    CMC.Transformers.getUserSigByReferenceFromVerification = function ($scope, options) {
        var res = {
            "reference": $scope.reference
        };
        return res;
    };
}
/*--------getUserSigByReferenceAndBirthDate-----------------------------------------------------------------------------*/
{
    CMC.Transformers.getUserSigByReferenceAndBirthDateIdentification = function ($scope, options) {
        var res = {
            "clientNumber": $scope.userSig.reference,
            "birthDate": $scope.userSig.birthDate.year + "-" + $scope.userSig.birthDate.month + "-" + $scope.userSig.birthDate.day
        };
        return res;
    };


    CMC.Parsers.getUserSigByReferenceAndBirthDateIdentification = function (context) {
        return function (data, status, headers, config, statusText) {

            if (data.resultatClientInternet && data.resultatClientInternet.client && data.resultatClientInternet.adresse) {
                var client = data.resultatClientInternet.client;
                var adresse = data.resultatClientInternet.adresse;
                var userSig = {
                    "street3": adresse.ligne3 || '',
                    "street2": (adresse.ligne1 || '') + ' ' + (adresse.ligne2 || ''),
                    "street1": adresse.ligne1 || '',
                    "postalCode": adresse.codePostal || '',
                    "country": adresse.pays || '',
                    "NPAI": adresse.nPAI || '',
                    "city": adresse.bureauDistributeur || '',

                    "mobile": client.telephoneMobile || '',
                    "phone": client.telephoneFixe || '',
                    "email": client.email || '',

                    "prefix": client.titreCivil == "Monsieur" ? "01" : "02" || '',
                    "lastname": client.nom || '',
                    "firstname": client.prenom || '',

                    "acceptCom": client.donneesCommuniquables || '',
                    "stateLabel": client.statut || '',
                    "groupPay": client.regroupementPrelevements || '',
                    "acceptContract": client.sollicitation || ''
                };

                d = new Date(userSig.birthDate);
                var birthDate = client.dateNaissance.split("T")[0].split("-");
                userSig.birthDate = {
                    "day": birthDate[2],
                    "month": birthDate[1],
                    "year": birthDate[0]
                }

                var city = adresse;
                city.label = adresse.bureauDistributeur;
                city.libelle = adresse.label;

                userSig.city = city;

                context.defered.resolve(
                    {
                        "userSig": userSig,
                        "email": userSig.email,
                        "city": city
                    }
                );
            } else {
                var msg;
                context.parseError(context)(data, status, headers, config, statusText, context.defered);
            }
        };
    };
}
/*--------getCities-----------------------------------------------------------------------------*/
{
    CMC.Transformers.getCities = function (postalCode) {
        var res = {
            "codePostal": postalCode,
            "debug": null
        };
        return res;
    };

    CMC.Parsers.getCities = function (context) {
        return function (data, status, headers, config, statusText) {
            if (data.messageAnomalie || !data.resultatCommunes.communes) {
                context.parseError({"msg": "erreur serveur", "data": data});
                return;
            }

            var cities = [];
            if (typeof data.resultatCommunes.communes.length != "undefined") {
                for (var i = 0; i < data.resultatCommunes.communes.length; i++) {
                    var city = data.resultatCommunes.communes[i];
                    cities.push(city);
                    cities[i].label = city.libelle;
                }
            } else {
                var city = data.resultatCommunes.communes;
                cities.push(city);
                cities[0].label = city.libelle;
            }

            context.defered.resolve(cities);
        };
    };
}
/*----------createUserSig ---------------------------------------------------------------------------*/
{
    CMC.Transformers.createUserSig = function ($scope, options) {
        var res = {
            "save": 1,
            "update": 0,

            "clientNumber": $scope.userSig.reference || "",
            "clientReference": $scope.userSig.reference || "",
            "reference": $scope.userSig.reference || "",

            "civilite": $scope.userSig.prefix || "",
            "prenom": $scope.userSig.firstname || "",
            "nom": $scope.userSig.lastname || "",
            "dateNaissance": $scope.userSig.dateNaissance,

            "ligne4": $scope.userSig.street4 || "",
            "ligne3": $scope.userSig.street3 || "",
            "ligne2": $scope.userSig.street2 || "",
            "ligne1": $scope.userSig.street1 || "",

            "bureauDistributeur": $scope.userSig.city.bureauDistributeur,
            "codeInseeCommune": $scope.userSig.city.codeInseeCommune || "",
            "codePostal": $scope.userSig.postalCode || "",
            "pays": $scope.userSig.country || "France",

            "telephoneProfessionnel": $scope.userSig.office || "",
            "telephoneMobile": $scope.userSig.mobile || "",
            "telephoneFixe": $scope.userSig.phone || "",

            "eMail": $scope.userSel.email || "",

            "codeProduit": 3,//NMS
            "dateEffet": $scope.userSig.dateEffect || "",
            "dateDebutValidite": $scope.userSig.dateDebutValidite || "",
            "sollicitationAutresProduits": $scope.userSig.acceptPromotion || "",
            "donneesCommunicables": $scope.userSig.acceptCom || "",
            "codeCategorieSocioProfessionnelle": "",
            "raisonSociale": $scope.userSig.raisonSociale || "",
            "referenceHebergeur": $scope.userSig.referenceHebergeur || "",

            "iban": $scope.userSig.iban || "",
            "bic": $scope.userSig.bic || "",
            "regroupementPrelevements": $scope.userSig.regroupementPrelevements || "",
            "titulaireDuCompte": $scope.userSig.titulaireDuCompte || "",
            "isNotPayeur": 0,

            "debug": $scope.userSig.debug
        };

        return res;
    };

    CMC.Parsers.createUserSig = function (context) {
        return function (data, status, headers, config, statusText) {
            if (!data.resultatSaisieClient || !data.resultatSaisieClient.libelleEvenement || data.resultatSaisieClient.libelleEvenement != "client crée actif") {
                context.parseError(context)({"msg": "erreur serveur", "data": data});
                return;
            }

            if (data.resultatSaisieClient && data.resultatSaisieClient.libelleEvenement && data.resultatSaisieClient.libelleEvenement == "client crée actif") {
                context.defered.resolve(data.resultatSaisieClient);
                // origin context.defered.resolve(data.resultatSaisieClient.referenceClient);
                return;
            }

            context.parseError(context)({"msg": "erreur serveur", "data": data});
            return;
        }
    };

}
/*----------searchUserSig---------------------------------------------------------------------------*/
{
    CMC.Transformers.searchUserSig = function ($scope, options) {
        var res = {
            clientNumber: $scope.userSig.reference,//\D+ true        Numéro client://\D+ true        Numéro client,//SIG
            dateNaissance: $scope.userSig.birthDate.year + "-" + $scope.userSig.birthDate.month + "-" + $scope.userSig.birthDate.day,//true        date de naissance du client
            prenom: $scope.userSig.firstname,//\w+ true        prénom du client
            nom: $scope.userSig.lastname,//\w+ true        nom du client client
            codePostal: $scope.userSig.postalCode,//\D+ true        code postal du client
            eMail: $scope.userSel.email,//\w+ true        Email client
            telephoneMobile: $scope.userSig.mobil,//\D+ true        telephone Mobile
            reference: $scope.userSig.reference,//\D+ false       numero client
        };

        return res;
    };

    CMC.Parsers.searchUserSig = function (context) {
        return function (data, status, headers, config, statusText) {
            var userSigCollec = [];
            //---------------------------
            // Pas de user trouvé :
            if (data.client.length === 0) {
                context.defered.resolve(userSigCollec);
            }

            //---------------------------
            // Un User :
            if (data.client.length == 1) {
                userSigCollec.push(giveMeUserSig(data.client[0]))
                context.defered.resolve(userSigCollec);
            }

            //---------------------------
            // Plusieur User:
            if (data.client.length > 1) {
                for (var i = 0; i < data.client.length; i++) {
                    var rawClient = data.client[i];
                    userSigCollec.push(giveMeUserSig(rawClient));
                }
                context.defered.resolve(userSigCollec)
            }

            //****************************
            // Tool - map UserSig response au model UserSig de l'appli
            function giveMeUserSig(userSigServerResponse) {
                var userSig = {
                    "street3": userSigServerResponse.adresse.ligne3 || '',
                    "street2": (userSigServerResponse.adresse.ligne1 || '') + ' ' + (userSigServerResponse.adresse.ligne2 || ''),
                    "street1": userSigServerResponse.adresse.ligne1 || '',
                    "postalCode": userSigServerResponse.adresse.codePostal || '',
                    "country": userSigServerResponse.adresse.pays || '',
                    "NPAI": userSigServerResponse.adresse.nPAI || '',
                    "city": userSigServerResponse.adresse.bureauDistributeur || '',

                    "mobile": userSigServerResponse.telephoneMobile || '',
                    "phone": userSigServerResponse.telephoneFixe || '',
                    "email": userSigServerResponse.eMail || '',

                    "prefix": userSigServerResponse.civilite === 1 ? "01" : "02" ,
                    "lastname": userSigServerResponse.nom || '',
                    "firstname": userSigServerResponse.prenom || '',
                    "birthDate": userSigServerResponse.dateNaissance || '',

                    "acceptCom": userSigServerResponse.donneesCommunicables || '',
                    "stateLabel": userSigServerResponse.libelleEtat || '',
                    "groupPay": userSigServerResponse.regroupementPrelevements || '',
                    "acceptContract": userSigServerResponse.sollicitationAutresProduits || ''
                };

                //-----------------
                // Change le format la date :
                var userSigBirth = moment(userSigServerResponse.dateNaissance);

                userSig.birthDate = {
                    day:   userSigBirth.format("DD"),
                    month: userSigBirth.format("MM"),
                    year:  userSigBirth.format("YYYY")
                };

                return userSig;
            };
        };
    };

}

/*----------processOrder---------------------------------------------------------------------------*/
{

    CMC.Transformers.processOrder = function ($scope, options) {
        var res = {
                "quoteId":      $scope.userInfo.quoteId,
                "prefix":       $scope.userSig.prefix,
                "lastname":     $scope.userSig.lastname,
                "firstname":    $scope.userSig.firstname,

                "street":       $scope.userSig.street3,
                "postcode":     $scope.userSig.postalCode,
                "city":         $scope.userSig.city.label,

                "telephone":    $scope.userSig.mobile || "",
                "email":        $scope.userSig.email || $scope.userSel.email || "",
                "cardOrderId":  $scope.userInfo.cardOrderId,
                "refContratSig":$scope.userInfo.refContratSig
        };
        return res;
    };

    CMC.Parsers.processOrder = function (context) {
        return function (data, status, headers, config, statusText) {

            if (data.code && data.code == 100) {
                context.parseError(context)({"msg": "erreur serveur", "data": data});
            } else {
                context.defered.resolve(data);
            }

        }
    };
}

// API : Validation commande de carte SIG
/*----------saisirOrange---------------------------------------------------------------------------*/
CMC.Transformers.processSaisirOrange = function ($scope, options) {

    var res = {
            // *** OBLIGATOIRE  ***
            referencePorteur: $scope.userSig.reference,
            dateDebutValidite: moment().format(),
            codeProduit: 3,
            // ***              ***
            raisonSocialeEmployeur: "",
            numeroSiretEmployeur: "",
            codePostalEmployeur: "",
            codeMoyenPaiement: "",
            montant: "" || "",
            codeLieuLivraison: "" || "" || ""
    };

    return res;
};

