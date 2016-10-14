SEL.Transformers = {};
SEL.Parsers = {};
/*-----------abstract------------------------------------------------------------------------*/
{    SEL.IO = function($q, $sender, $rootScope) {

        this.createRequest = function (routeName, parameters, transformer, parser, parserError) {
            this.routeName   = routeName;
            this.parameters  = parameters;
            this.transformer = transformer;
            this.parser      = parser;
            this.parserError = parserError;
        };

        this.execute = function(routeName, parameters, transformer, parser, parserError) {
            this.createRequest(routeName, parameters, transformer, parser, parserError);

            return this.executeRequest();
        }

        this.setRouteName = function(routeName, context) {
            context = context || this;
            context.routeName = routeName;
        };

        this.formatParameter = function(context) {
            context = context || this;
            if (context.transformer) {
                return context.transformer(context.parameters);
            }

            return SEL.Transformers.IOTransformer(context.parameters);
        };

        this.parseResponse = function(context) {
            context = context || this;
            if(context.parser) {
                return context.parser(context);
            }

            return SEL.Parsers.IOParser(context);
        };

        this.parseError = function(context) {
            context = context || this;
            if(context.errorParser) {
                return context.errorParser(context);
            }

            return SEL.Parsers.IOParserError(context);
        };

        this.serveurError = function(context, exceptionE) {
            context.defered.reject(exceptionE);
        };

        this.executeRequest = function() {
            $rootScope.$broadcast("sendRequest");
            try {
                var context = this;
                this.defered = $q.defer();
                $sender.send(
                    SEL.routes2[this.routeName].method,
                    SEL.routes2[this.routeName].url,
                    this.formatParameter(this),
                    function success(data, status, headers, config, statusText) {
                        $rootScope.$broadcast("receiveResponse");
                        context.parseResponse(context)(data, status, headers, config, statusText);
                    },
                    function error(data, status, headers, config, statusText) {
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
    SEL.Transformers.IOTransformer = function(rawParameters) {
        return rawParameters;
    };

    SEL.Parsers.IOParser = function(context) {
        return function(data, status, headers, config, statusText) {
            if (data) {
                context.defered.resolve(data);
            } else {
                context.parseError(context)(data, status, headers, config, statusText, context.defered);
            }
        };
    };

    SEL.Parsers.IOParserError = function(context) {
        return function(data, status, headers, config, statusText) {
            context.defered.reject(data);
        }
    };

}
/*-----------getUserCase------------------------------------------------------------------------------*/
    SEL.Transformers.getUserCaseFromPorteur = function($scope) {
        var res = {
            "reference": $scope.userSel.reference || "",
            "email":     $scope.userSel.email || "",
            "hasCard":   $scope.userInfo.hasCard || "",
            "newUser":   $scope.userInfo.isNew || ""
        };
        return res;
    }

    SEL.Parsers.getUserCaseFromPorteur = function(context) {
        return function(data, status, headers, config, statusText) {
            if (data && data.atomCase ) {
                context.defered.resolve(
                    {
                        "useCase":  data.atomCase.GET_CASE,
                        "reference": data.atomCase.reference,
                        "NPAI":      data.atomCase.SIG_STATE.NPAI
                    }
                );
            } else {
                context.parseError(context)(data, status, headers, config, statusText, context.defered);
            }
        };
    }
/*-----------searchUserAndSave------------------------------------------------------------------------*/
{
    SEL.Transformers.searchUserAndSaveSample = function($scope, options) {
        var res = {
            "clientNumber": $scope.reference,
            "dateNaissance":$scope.birthDate,
            "prenom":                            null,
            "nom":                               null,
            "codePostal":                        null,
            "eMail":                             null,
            "codeProduit":                       null,
            "save":                              null,
            "update":                            null,
            "regroupementPrelevements":          null,
            "telephoneProfessionnel":            null,
            "telephoneFixe":                     null,
            "telephoneMobile":                   null,
            "codeCategorieSocioProfessionnelle": null,
            "reference": $scope.reference,
            "sollicitationAutresProduits":       null,
            "bureauDistributeur":                null,
            "donneesCommunicables":              null,
            "ligne3":                            null,
            "ligne2":                            null,
            "ligne1":                            null,
            "codeInseeCommune":                  null,
            "pays":                              null,
            "ligne4":                            null,
            "dateEffet":                         null,
            "raisonSociale":                     null,
            "civilite":                          null,
            "referenceHebergeur":                null,
            "iban":                              null,
            "bic":                               null,
            "titulaireDuCompte":                 null,
            "dateDebutValidite":                 null,
            "isNotPayeur":                       null,
            "clientReference":                   null,
            "debug":                             null
        };
        return res;
    };
}

/*----------createUserSel---------------------------------------------------------------------------*/
{
    SEL.Transformers.createUserSelFromInscription = function($scope, options) {
        var res = {
            "fos_user_registration_form": {
                "email": $scope.email,
                "plainPassword": {
                    "first":  $scope.password,
                    "second": $scope.password
                }
            },
            "recaptcha_challenge_field" :  SEL.secretCaptcha,
            "recaptcha_response_field": $scope.response,
            "reference": $scope.reference
        };

        return res;
    };
}
/*----------createFullUserSel---------------------------------------------------------------------------*/
{
    SEL.Transformers.createFullUserSel = function($scope, options) {
        var res = {
            "civilite":        $scope.userSig.prefix || "",
            "prenom":          $scope.userSig.firstname || "",
            "nom":             $scope.userSig.lastname || "",
            "telephoneMobile": $scope.userSig.mobile || "",
            "city":            $scope.userSig.city.libelle || "",
            "ligne3":          $scope.userSig.street3 || "",
            "ligne2":          $scope.userSig.street2 || "",
            "codePostal":      $scope.userSig.postalCode || "",
            "pays":            $scope.userSig.country || "",

            "eMail":           $scope.userSel.email || "",
            "password":        $scope.userSel.password || "",

            "clientNumber":    $scope.userSig.reference || ""
        };

        return res;
    };
}

/*----------updateUserSelFull---------------------------------------------------------------------------*/
{
    SEL.Transformers.updateUserSelFull = function($scope, options) {
        var res = {
            "prefix":    $scope.userSig.prefix || "",
            "firstname": $scope.userSig.firstname || "",
            "lastname":  $scope.userSig.lastname || "",
            "mobile":    $scope.userSig.mobile || "",
            "city":      $scope.userSig.city.libelle || "",
            "street3":   $scope.userSig.street3 || "",
            "street2":   $scope.userSig.street2 || "",
            "postalCode":$scope.userSig.postalCode || "",
            "country":   $scope.userSig.country || "",

            "email":     $scope.userSel.email || "",
            "password":  $scope.userSel.password || "",

            "reference": $scope.userSel.reference || ""
        };

        return res;
    };
}
/*----------isUserSel---------------------------------------------------------------------------*/
{
    SEL.Transformers.isUserSelFromInscription = function($scope, options) {
        var res = {
            "email": $scope.email
        };

        return res;
    };
}
/*----------getUserSel---------------------------------------------------------------------------*/
{
    SEL.Transformers.getUserSelFromInscription = function($scope, options) {
        var res = {
            "email":    $scope.userSel.email
        };
        return res;
    };

    SEL.Parsers.getUserSelFromInscription = function(context) {
        return function(data, status, headers, config, statusText) {
            context.defered.reject("cet utilisateur existe déjà");
        };
    };

    SEL.Parsers.errorGetUserSelFromInscription = function(context) {
        return function(data, status, headers, config, statusText) {
            context.defered.resolve(data);
        };
    };

}
/*--------getUserSigByReference-----------------------------------------------------------------------------*/
{
    SEL.Transformers.getUserSigByReferenceFromPorteur = function($scope, options) {
        var res = {
            "clientNumber":    $scope.userSel.reference
        };
        return res;
    };


    SEL.Parsers.getUserSigByReferenceFromPorteur = function(context){
        return function(data, status, headers, config, statusText) {

            if (data.resultatClient && data.resultatClient.client) {
                var client = data.resultatClient.client;
                var userSig = {
                    "street3":    client.adresse.ligne3 || '',
                    "street2":    client.adresse.ligne2 || '',
                    "postalCode": client.adresse.codePostal || '',
                    "country":    client.adresse.pays || '',
                    "NPAI":       client.adresse.nPAI || '',
                    "city":       client.adresse.bureauDistributeur || '',

                    "mobile": client.telephoneMobile || '',
                    "phone": client.telephoneFixe || '',
                    "email":  client.eMail || '',

                    "prefix":    client.civilite || '',
                    "lastname":  client.nom || '',
                    "firstname": client.prenom || '',
                    "birthDate": client.dateNaissance || '',

                    "acceptCom":  client.donneesCommunicables || '',
                    "stateLabel": client.libelleEtat || '',
                    "groupPay":   client.regroupementPrelevements || '',
                    "acceptContract":  client.sollicitationAutresProduits || ''
                };
                userSig = SEL.MODEL.overwriteObject(userSig, SEL.objects.userSig);
                d = new Date(userSig.birthDate);
                userSig.birthDate  = {
                    "day": d.getDate() < 10 ? "0" + d.getDate() : "" + d.getDate(),
                    "month": d.getMonth() + 1 < 10 ? "0" + (d.getMonth()+1) : "" + (d.getMonth()+1),
                    "year": "" + d.getFullYear()
                }

                var city = client.adresse;
                city.label = city.bureauDistributeur;
                city.libelle = city.label;

                 userSig.city = city;


                context.defered.resolve(
                    {
                        "userSig": userSig,
                        "email":   userSig.email,
                        "city":    city
                    }
                );
            } else {
                var msg;
                context.parseError(context)(data, status, headers, config, statusText, context.defered);
            }
        };
    };
    SEL.Transformers.getUserSigByReferenceFromVerification = function($scope, options) {
        var res = {
            "reference":  $scope.reference
        };
        return res;
    };
}
/*--------getUserSigByReferenceAndBirthDate-----------------------------------------------------------------------------*/
{
    SEL.Transformers.getUserSigByReferenceAndBirthDateIdentification = function($scope, options) {
        var res = {
            "clientNumber":    $scope.userSig.reference,
            "birthDate":       $scope.userSig.birthDate.year + "-" + $scope.userSig.birthDate.month + "-" + $scope.userSig.birthDate.day
        };
        return res;
    };


    SEL.Parsers.getUserSigByReferenceAndBirthDateIdentification = function(context){
        return function(data, status, headers, config, statusText) {

            if (data.resultatClientInternet && data.resultatClientInternet.client && data.resultatClientInternet.adresse) {
                var client = data.resultatClientInternet.client;
                var adresse = data.resultatClientInternet.adresse;
                var userSig = {
                    "street3":    adresse.ligne3 || '',
                    "street2":    adresse.ligne2 || '',
                    "postalCode": adresse.codePostal || '',
                    "country":    adresse.pays || '',
                    "NPAI":       adresse.nPAI || '',
                    "city":       adresse.bureauDistributeur || '',

                    "mobile": client.telephoneMobile || '',
                    "phone": client.telephoneFixe || '',
                    "email":  client.email || '',

                    "prefix":    client.titreCivil == "Monsieur" ? "01" : "02" || '',
                    "lastname":  client.nom || '',
                    "firstname": client.prenom || '',

                    "acceptCom":  client.donneesCommuniquables || '',
                    "stateLabel": client.statut || '',
                    "groupPay":   client.regroupementPrelevements || '',
                    "acceptContract":  client.sollicitation || ''
                };

                userSig = SEL.MODEL.overwriteObject(userSig, SEL.objects.userSig);

                d = new Date(userSig.birthDate);
                var birthDate = client.dateNaissance.split("T")[0].split("-");
                userSig.birthDate  = {
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
                        "email":   userSig.email,
                        "city":    city
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
    SEL.Transformers.getCities = function(postalCode) {
        var res = {
            "codePostal": postalCode,
            "debug": null
        };
        return res;
    };

    SEL.Parsers.getCities = function(context){
        return function(data, status, headers, config, statusText) {
            if (data.messageAnomalie || !data.resultatCommunes.communes) {
                context.parseError(context)({"msg":"erreur serveur", "data":data});
                return;
            }

            var cities = [];
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

            context.defered.resolve(cities);
        };
    };
}
/*----------createUserSig ---------------------------------------------------------------------------*/
{
    SEL.Transformers.createUserSig = function($scope, options) {


        var res = {
            "save":          1,
            "update":        0,

            "clientNumber":      $scope.userSig.reference || "",
            "clientReference":   $scope.userSig.reference || "",
            "reference":         $scope.userSig.reference || "",

            "civilite":      $scope.userSig.prefix || "",
            "prenom":        $scope.userSig.firstname || "",
            "nom":           $scope.userSig.lastname || "",
            "dateNaissance": $scope.userSig.birthDate.year + "-" + $scope.userSig.birthDate.month + "-" + $scope.userSig.birthDate.day,

            "ligne4": $scope.userSig.street4 || "",
            "ligne3": $scope.userSig.street3 || "",
            "ligne2": $scope.userSig.street2 || "",
            "ligne1": $scope.userSig.street1 || "",

            "bureauDistributeur": $scope.userSig.city.bureauDistributeur,
            "codeInseeCommune":   $scope.userSig.city.codeInseeCommune || "",
            "codePostal":         $scope.userSig.postalCode || "",
            "pays":               $scope.userSig.country || "France",

            "telephoneProfessionnel": $scope.userSig.office || "",
            "telephoneMobile":        $scope.userSig.mobile || "",
            "telephoneFixe":          $scope.userSig.phone || "",

            "eMail": $scope.userSel.email || "",

            "codeProduit":   3,//NMS
            "dateEffet":                         $scope.userSig.dateEffect || "",
            "dateDebutValidite":                 $scope.userSig.dateDebutValidite || "",
            "sollicitationAutresProduits":       $scope.userSig.acceptPromotion || "",
            "donneesCommunicables":              $scope.userSig.acceptCom || "",
            "codeCategorieSocioProfessionnelle": "",
            "raisonSociale":                     $scope.userSig.raisonSociale || "",
            "referenceHebergeur":                $scope.userSig.referenceHebergeur || "",

            "iban":                     $scope.userSig.iban || "",
            "bic":                      $scope.userSig.bic || "",
            "regroupementPrelevements": $scope.userSig.regroupementPrelevements || "",
            "titulaireDuCompte":        $scope.userSig.titulaireDuCompte || "",
            "isNotPayeur":              false,

            "debug": $scope.userSig.debug
        }

        return res;
    };

    SEL.Parsers.createUserSig = function(context) {
        return function(data, status, headers, config, statusText) {
            if (!data.resultatSaisieClient || !data.resultatSaisieClient.libelleEvenement || data.resultatSaisieClient.libelleEvenement != "client crée actif") {
                context.parseError(context)({"msg":"erreur serveur", "data":data});

                return;
            }

            if (data.resultatSaisieClient && data.resultatSaisieClient.libelleEvenement && data.resultatSaisieClient.libelleEvenement == "client crée actif") {
                context.defered.resolve(data.resultatSaisieClient.client.reference);

                return;
            }
            context.parseError(context)({"msg":"erreur serveur", "data":data});

            return;
        }
    };

}

/*----------updateUserSig ---------------------------------------------------------------------------*/
{
    SEL.Transformers.updateUserSig = function($scope, options) {
        var res = {
            "save":          0,
            "update":        1,

            "clientNumber":      $scope.userSel.reference || "",
            "clientReference":   $scope.userSel.reference || "",
            "reference":         $scope.userSel.reference || "",

            "civilite":      $scope.userSig.prefix || "",
            "prenom":        $scope.userSig.firstname || "",
            "nom":           $scope.userSig.lastname || "",
            "dateNaissance": $scope.userSig.birthDate.year + "-" + $scope.userSig.birthDate.month + "-" + $scope.userSig.birthDate.day,

            "ligne4": $scope.userSig.street4 || "",
            "ligne3": $scope.userSig.street3 || "",
            "ligne2": $scope.userSig.street2 || "",
            "ligne1": $scope.userSig.street1 || "",

            "bureauDistributeur": $scope.userSig.city.bureauDistributeur,
            "codeInseeCommune":   $scope.userSig.city.codeInseeCommune || "",
            "codePostal":         $scope.userSig.postalCode || "",
            "pays":               $scope.userSig.country || "France",

            "telephoneProfessionnel": $scope.userSig.office || "",
            "telephoneMobile":        $scope.userSig.mobile || "",
            "telephoneFixe":          $scope.userSig.phone || "",

            "eMail": $scope.userSel.email || "",

            "codeProduit":   3,//NMS
            "dateEffet":                         $scope.userSig.dateEffect || "",
            "dateDebutValidite":                 $scope.userSig.dateDebutValidite || "",
            "sollicitationAutresProduits":       $scope.userSig.acceptPromotion || "",
            "donneesCommunicables":              $scope.userSig.acceptCom || "",
            "codeCategorieSocioProfessionnelle": "",
            "raisonSociale":                     $scope.userSig.raisonSociale || "",
            "referenceHebergeur":                $scope.userSig.referenceHebergeur || "",

            "iban":                     $scope.userSig.iban || "",
            "bic":                      $scope.userSig.bic || "",
            "regroupementPrelevements": $scope.userSig.regroupementPrelevements || "",
            "titulaireDuCompte":        $scope.userSig.titulaireDuCompte || "",
            "isNotPayeur":              false,

            "debug": $scope.userSig.debug
        }

        return res;
    };

    SEL.Parsers.updateUserSig = function(context) {
        return function(data, status, headers, config, statusText) {
            if (!data.resultatSaisieClient || !data.resultatSaisieClient.libelleEvenement || data.resultatSaisieClient.libelleEvenement != "Données clients modifiées") {
                context.parseError(context)({"msg":"erreur serveur", "data":data});
                return;
            }

            if (data.resultatSaisieClient && data.resultatSaisieClient.libelleEvenement && data.resultatSaisieClient.libelleEvenement == "Données clients modifiées") {
                context.defered.resolve(data.resultatSaisieClient.client.reference);
                return;
            }

            context.parseError(context)({"msg":"erreur serveur", "data":data});
        }
    };

}

/*----------updateUserSig ---------------------------------------------------------------------------*/
{
    SEL.Transformers.updateUserSig = function($scope, options) {
        var res = {
            "save":          0,
            "update":        1,

            "clientNumber":      $scope.userSel.reference || "",
            "clientReference":   $scope.userSel.reference || "",
            "reference":         $scope.userSel.reference || "",

            "civilite":      $scope.userSig.prefix || "",
            "prenom":        $scope.userSig.firstname || "",
            "nom":           $scope.userSig.lastname || "",
            "dateNaissance": $scope.userSig.birthDate.year + "-" + $scope.userSig.birthDate.month + "-" + $scope.userSig.birthDate.day,

            "ligne4": $scope.userSig.street4 || "",
            "ligne3": $scope.userSig.street3 || "",
            "ligne2": $scope.userSig.street2 || "",
            "ligne1": $scope.userSig.street1 || "",

            "bureauDistributeur": $scope.userSig.city.bureauDistributeur,
            "codeInseeCommune":   $scope.userSig.city.codeInseeCommune || "",
            "codePostal":         $scope.userSig.postalCode || "",
            "pays":               $scope.userSig.country || "France",

            "telephoneProfessionnel": $scope.userSig.office || "",
            "telephoneMobile":        $scope.userSig.mobile || "",
            "telephoneFixe":          $scope.userSig.phone || "",

            "eMail": $scope.userSel.email || "",

            "codeProduit":   3,//NMS
            "dateEffet":                         $scope.userSig.dateEffect || "",
            "dateDebutValidite":                 $scope.userSig.dateDebutValidite || "",
            "sollicitationAutresProduits":       $scope.userSig.acceptPromotion || "",
            "donneesCommunicables":              $scope.userSig.acceptCom || "",
            "codeCategorieSocioProfessionnelle": "",
            "raisonSociale":                     $scope.userSig.raisonSociale || "",
            "referenceHebergeur":                $scope.userSig.referenceHebergeur || "",

            "iban":                     $scope.userSig.iban || "",
            "bic":                      $scope.userSig.bic || "",
            "regroupementPrelevements": $scope.userSig.regroupementPrelevements || "",
            "titulaireDuCompte":        $scope.userSig.titulaireDuCompte || "",
            "isNotPayeur":              false,

            "debug": $scope.userSig.debug
        }

        return res;
    };

    SEL.Parsers.updateUserSig = function(context) {
        return function(data, status, headers, config, statusText) {
            if (!data.resultatSaisieClient || !data.resultatSaisieClient.libelleEvenement || data.resultatSaisieClient.libelleEvenement != "Données clients modifiées") {
                context.parseError(context)({"msg":"erreur serveur", "data":data});
                return;
            }

            if (data.resultatSaisieClient && data.resultatSaisieClient.libelleEvenement && data.resultatSaisieClient.libelleEvenement == "Données clients modifiées") {
                context.defered.resolve(data.resultatSaisieClient.client.reference);
                return;
            }

            context.parseError(context)({"msg":"erreur serveur", "data":data});
            return;
        }
    };

}
/*----------searchUserSig---------------------------------------------------------------------------*/
{
    SEL.Transformers.searchUserSig = function($scope, options) {
        var res = {
            clientNumber:    $scope.userSig.reference,//\D+ true        Numéro client://\D+ true        Numéro client,//SIG
            dateNaissance:   $scope.userSig.birthDate.year + "-" + $scope.userSig.birthDate.month + "-" + $scope.userSig.birthDate.day,//true        date de naissance du client
            prenom:          $scope.userSig.firstname,//\w+ true        prénom du client
            nom:             $scope.userSig.lastname,//\w+ true        nom du client client
            codePostal:      $scope.userSig.postalCode,//\D+ true        code postal du client
            eMail:           $scope.userSel.email,//\w+ true        Email client
            telephoneMobile: $scope.userSig.mobil,//\D+ true        telephone Mobile
            reference:       $scope.userSig.reference,//\D+ false       numero client
        };

        return res;
    };

    SEL.Parsers.searchUserSig = function(context){
        return function(data, status, headers, config, statusText) {

            if (data.client) {
                var client = data.client;
                var userSig = {
                    "street3":    client.adresse.ligne3 || '',
                    "street2":    client.adresse.ligne2 || '',
                    "postalCode": client.adresse.codePostal || '',
                    "country":    client.adresse.pays || '',
                    "NPAI":       client.adresse.nPAI || '',
                    "city":       client.adresse.bureauDistributeur || '',

                    "mobil": client.telephoneMobile || '',
                    "phone": client.telephoneFixe || '',
                    "email":  client.eMail || '',

                    "prefix":    client.civilite || '',
                    "lastname":  client.nom || '',
                    "firstname": client.prenom || '',
                    "birthDate": client.dateNaissance || '',

                    "acceptCom":  client.donneesCommunicables || '',
                    "stateLabel": client.libelleEtat || '',
                    "groupPay":   client.regroupementPrelevements || '',
                    "acceptContract":  client.sollicitationAutresProduits || ''
                };

                d = new Date(userSig.birthDate);
                userSig.birthDate  = {
                    "day": d.getDate() < 10 ? "0" + d.getDate() : "" + d.getDate(),
                    "month": d.getMonth() + 1 < 10 ? "0" + (d.getMonth()+1) : "" + (d.getMonth()+1),
                    "year": "" + d.getFullYear()
                }

                var city = client.adresse;
                city.label = city.bureauDistributeur;
                city.libelle = city.label;

                 userSig.city = city;


                context.defered.resolve(
                    {
                        "userSig": userSig,
                        "email":   userSig.email,
                        "city":    city
                    }
                );
            } else {
                var msg;
                context.parseError(context)(data, status, headers, config, statusText, context.defered);
            }
        };
    };
}
/*----------processOrder---------------------------------------------------------------------------*/
{
    SEL.Transformers.processOrder = function($scope, options) {
        /*var res = {
            "data" : {
                "prefix": $scope.userSig.prefix,
                "lastname": $scope.userSig.lastname,
                "firstname": $scope.userSig.firstname,

                "street": $scope.userSig.street3,
                "postcode": $scope.userSig.postalCode,
                "city": $scope.userSig.city.label,
                "country": $scope.userSig.country,

                "telephone": $scope.userSig.mobil || "",
                "email": $scope.userSig.email || $scope.userSel.email || ""
            }
        };*/

        var res = {
                "prefix": "MR.",
                "lastname": "dhaoihd",
                "firstname": "azdaz",

                "street": "rue de la rue",
                "postcode": "91200",
                "city": "city",
                "country": "France",

                "telephone": "0603598106",
                "email":  "OO2@OOO.FR"
        };

        return res;
    };

    SEL.Parsers.processOrder = function(context) {
        return function(data, status, headers, config, statusText) {
            if (data.code && data.code == 100) {
                context.parseError(context)({"msg":"erreur serveur", "data": data});
            } else {
                context.defered.resolve(data);
            }
        }
    };
}

/*----------customerCustomerCreate---------------------------------------------------------------------------*/
{
    SEL.Transformers.customerCustomerCreate = function($scope, options) {
        var res = {
            'eMail': $scope.userSig.email,
            'prenom': $scope.userSig.firstname,
            'nom': $scope.userSig.lastname
        };

        return res;
    };

    SEL.Parsers.customerCustomerCreate = function(context) {
        return function(data, status, headers, config, statusText) {
            if (data.code && data.code == 100) {
                context.parseError(context)({"msg":"erreur serveur", "data": data});
            } else {
                context.defered.resolve(data);
            }
        }
    };
}
/*----------putCustomerAddress---------------------------------------------------------------------------*/
{
   SEL.Transformers.putCustomerAddress = function($scope, options) {

        var res = {
            'customerId': $scope.userSig.customerId,
            'customerData': {
                'prenom': $scope.userSig.firstname,
                'nom':  $scope.userSig.lastname,
                'ligne3':    $scope.userSig.street3,
                'codePostal':  $scope.userSig.postalCode,
                'telephoneMobile': $scope.userSig.mobile,
                'city':    $scope.userSig.city
            }
        };

        return res;
    };

    SEL.Parsers.putCustomerAddress = function(context) {
        return function(data, status, headers, config, statusText) {
            if (data.code && data.code == 100) {
                context.parseError(context)({"msg":"erreur serveur", "data": data});
            } else {
                context.defered.resolve(data);
            }
        }
    };
}

/*----------putCartCustomer---------------------------------------------------------------------------*/
{
/*   SEL.Transformers.putCartCustomer = function(customerId, cartId, options) {

        var res = {
            "cartId": cartId,
            "customerMagentoId": customerId;
        }

        return res;
    };*/

    SEL.Parsers.putCartCustomer = function(context) {
        return function(data, status, headers, config, statusText) {
            if (data.code && data.code == 100) {
                context.parseError(context)({"msg":"erreur serveur", "data": data});
            } else {
                context.defered.resolve(data);
            }
        }
    };
}

/*----------updateStep---------------------------------------------------------------------------*/
{
   /*SEL.Transformers.updateStep = function(stepNumber, cartId, options) {

        var res = {
            "cartId": cartId,
            "step": stepNumber
        }

        return res;
    };*/

    SEL.Parsers.updateStep = function(context) {
        return function(data, status, headers, config, statusText) {
            if (data.code && data.code == 100) {
                context.parseError(context)({"msg":"erreur serveur", "data": data});
            } else {
                context.defered.resolve(data);
            }
        }
    };
}

// /*----------updateUserSig-------------------------------------------------------------------*/
// // {
// //     CMC.Model.prototype.updateUserSig = function(success, userError, parameters, options){
// //         this.success = success;
// //         this.userError = userError;
// //         this.parameters = parameters;
// //         this.options = options;
// //         this.routeName = "updateUserSig";
// //     };
// //     CMC.Model.prototype.updateUserSig.prototype = CMC.extending(CMC.Model.prototype.IO.prototype);
// //     CMC.Model.prototype.updateUserSig.prototype.formatParameter = function(parameters, options) {
// //         var res = {
// //             "fos_user_update_form": {
// //                 "email": parameters.email
// //             },
// //             "reference": parameters.reference
// //         };
// //         return res;
// //     };
// //     CMC.Transformers.updateUserSigFromDetail = function($scope, options) {
// //         var res = {
// //             reference: $scope.reference,//\D+ true        Numéro client: null,//SIG
// //             birthDate: $scope.birthDate,//true        date de naissance du client
// //             firstName: $scope.firstName,//\w+ true        prénom du client
// //             lastName: $scope.lastName,//\w+ true        nom du client client
// //             postalCode: $scope.postalCode,//\D+ true        code postal du client
// //             email: $scope.mail,//\w+ true        Email client
// //             mobil: $scope.mobil,//\D+ true        telephone Mobile
// //             //reference: null,//\D+ false       numero client
// //             debug: null//\d+ false       Mode bouchon vide = config, 0 : non 1 oui
// //         };
// //         return res;
// //     };

// // }
// /*----------updateUserAddressSel------------------------------------------------------------------*/
// {
//     CMC.Model.prototype.updateUserAddressSel = function(success, userError, parameters, options){
//         this.success = success;
//         this.userError = userError;
//         this.parameters = parameters;
//         this.options = options;
//         this.routeName = "updateUserAddressSel";
//     };
//     CMC.Model.prototype.updateUserAddressSel.prototype = CMC.extending(CMC.Model.prototype.IO.prototype);
//     CMC.Model.prototype.updateUserAddressSel.prototype.formatParameter = function(parameters, options) {
//         var res = {
//             "user_address_type": {
//                 "street1": parameters.street1,
//                 "street2": parameters.street2,
//                 "city":    parameters.city,
//                 "zip":     parameters.postalCode,
//                 "country": parameters.country,
//                 "phoneNumber": parameters.mobil,
//                 "phoneFix": parameters.phone,
//             },
//             "reference": parameters.reference
//         };
//         return res;
//     };
//     CMC.Model.prototype.updateUserAddressSel.prototype.parseResponse = function(context){
//         return function(data, status, headers, config, statusText) {

//             if (data.code != undefined && data.code == "0" && data.message != undefined && data.message == "Success") {
//                 context.success(data.code, data.message);
//             } else {
//                 context.userError(data.code, data.message);
//             }
//         };
//     };
//     CMC.Transformers.updateUserAddressSelFromVerification = function($scope, options) {
//         var res = {
//             "street1":    $scope.street1,
//             "street2":    $scope.street2,
//             "city":       $scope.city.bureauDistributeur,
//             "postalCode": $scope.postalCode,
//             "country":    $scope.country,
//             "mobil":      $scope.mobil,
//             "phone":      $scope.phone
//         };
//         return res;
//     };
// }

// /*--------getCities-----------------------------------------------------------------------------*/
// {
//     CMC.Model.prototype.getCities = function(success, userError, parameters, options){
//         this.success = success;
//         this.userError = userError;
//         this.parameters = parameters;
//         this.options = options;
//         this.routeName = "getCities";
//     };
//     CMC.Model.prototype.getCities.prototype = CMC.extending(CMC.Model.prototype.IO.prototype);
//     CMC.Model.prototype.getCities.prototype.formatParameter = function(parameters, options) {
//         var res = {
//             "codePostal": parameters.postalCode,
//             "debug": null
//         };
//         return res;
//     };
//     CMC.Model.prototype.getCities.prototype.parseResponse = function(context){
//         return function(data, status, headers, config, statusText) {
//             if (data.messageAnomalie || !data.resultatCommunes.communes) {
//                 context.userError("erreur serveur");
//                 return;
//             }

//             var cities = [];
//             if(typeof data.resultatCommunes.communes.length != "undefined") {
//                 for(var i=0; i < data.resultatCommunes.communes.length; i++) {
//                     var city = data.resultatCommunes.communes[i];
//                     cities.push(city);
//                     cities[i].label = city.libelle;
//                 }
//             } else {
//                 var city = data.resultatCommunes.communes;
//                 cities.push(city);
//                 cities[0].label = city.libelle;
//             }

//             var cityDetail = {};
//                 cityDetail.codePostal = cities[0].codePostal;
//                 cityDetail.codeInsee = cities[0].codeInsee;
//                 cityDetail.bureauDistributeur = cities[0].bureauDistributeur;
//                 cityDetail.city = cities[0].libelle;

//             context.success(cityDetail, cities);
//         };
//     };
//     CMC.Transformers.getCitiesFromVerification = function($scope, options) {
//         var res = {
//             "postalCode":  $scope.postalCode
//         };
//         return res;
//     };
// }
// /*--------getUserSel-----------------------------------------------------------------------------*/
// {
//     CMC.Model.prototype.getUserSel = function(success, userError, parameters, options){
//         this.success = success;
//         this.userError = userError;
//         this.parameters = parameters;
//         this.options = options;
//         this.routeName = "getUserSel";
//     };
//     CMC.Model.prototype.getUserSel.prototype = CMC.extending(CMC.Model.prototype.IO.prototype);
//     CMC.Model.prototype.getUserSel.prototype.formatParameter = function(parameters, options) {
//         var res = {
//             "email": parameters.mail,
//             "debug": null
//         };
//         return res;
//     };
//     CMC.Model.prototype.getUserSel.prototype.parseResponse = function(context){
//         return function(data, status, headers, config, statusText) {
//                 context.success(data);
//         };
//     };
//     CMC.Transformers.getUserSelFromCoordonnees = function($scope, options) {
//         var res = {
//             "mail":  $scope.mail
//         };
//         return res;
//     };
// }

