CX.Transformers = {};
/*-----------abstract------------------------------------------------------------------------*/
{
    CX.Model.prototype.IO = function (success, userError, parameters, options) {
        this.routeName;
        this.success = success;
        this.userError = userError;
        this.parameters = parameters;
        this.options = options;
    };

    CX.Model.prototype.IO.prototype.formatParameter = function(parameters, options) {
        var res = {};
        return res;
    };

    CX.Model.prototype.IO.prototype.parseResponse = function(context){
        return function(data, status, headers, config, statusText) {
            var finalResponse = data;
            // parse data
            // use options
            if (finalResponse) {
                context.success(finalResponse);
            } else {
                var msg;
                context.userError(msg);
            }
        };
    }

    CX.Model.prototype.IO.prototype.serveurError = function(context){
        return function(options) {
            var msg;
            context.userError(msg);
        }
    };

    CX.Model.prototype.IO.prototype.execute = function() {
        try {
            CX.MODEL.send(
                CX.routes[this.routeName].method,
                CX.routes[this.routeName].url,
                this.formatParameter(this.parameters, this.options),
                this.parseResponse(this),
                this.userError,
                this.options
            );
        } catch (e) {
            this.serveurError(this)(this.options, e);
        }
    };
}
/*-----------searchUserAndSave------------------------------------------------------------------------*/
{
    CX.Model.prototype.searchUserAndSave = function(success, userError, parameters, options) {
        this.success = success;
        this.userError = userError;
        this.parameters = parameters;
        this.options = options;
        this.routeName = "searchUserAndSave";
    };
    CX.Model.prototype.searchUserAndSave.prototype = CX.extending(CX.Model.prototype.IO.prototype);
    CX.Model.prototype.searchUserAndSave.prototype.formatParameter = function(parameters, options) {
        var res = {
            "clientNumber":  parameters.clientNumber,
            "dateNaissance": parameters.dateNaissance,
            "prenom":        parameters.prenom,
            "nom":           parameters.nom,
            "codePostal":    parameters.codePostal,
            "eMail":         parameters.eMail,
            "codeProduit":   parameters.codeProduit,
            "save":          parameters.save,
            "update":        parameters.update,
            "regroupementPrelevements": parameters.regroupementPrelevements,
            "telephoneProfessionnel":   parameters.telephoneProfessionnel,
            "telephoneFixe":            parameters.telephoneFixe,
            "telephoneMobile":          parameters.telephoneMobile,
            "codeCategorieSocioProfessionnelle": parameters.codeCategorieSocioProfessionnelle,
            "reference":                         parameters.reference,
            "sollicitationAutresProduits":       parameters.sollicitationAutresProduits,
            "bureauDistributeur":   parameters.bureauDistributeur,
            "donneesCommunicables": parameters.donneesCommunicables,
            "ligne3":               parameters.ligne3,
            "ligne2":               parameters.ligne2,
            "ligne1":               parameters.ligne1,
            "codeInseeCommune":   parameters.codeInseeCommune,
            "pays":               parameters.pays,
            "ligne4":             parameters.ligne4,
            "dateEffet":          parameters.dateEffet,
            "raisonSociale":      parameters.raisonSociale,
            "civilite":           parameters.civilite,
            "referenceHebergeur": parameters.referenceHebergeur,
            "iban": parameters.iban,
            "bic":  parameters.bic,
            "titulaireDuCompte": parameters.titulaireDuCompte,
            "dateDebutValidite": parameters.dateDebutValidite,
            "isNotPayeur":       parameters.isNotPayeur,
            "clientReference":   parameters.clientReference,
            "debug": parameters.debug
        }

        return res;
    };

    CX.Model.prototype.searchUserAndSave.prototype.parseResponse = function(context){
        return function(data, status, headers, config, statusText) {
            var finalResponse = {};
            // parse data
            // use options
            if (data.resultatSaisieClient && data.resultatSaisieClient.client) {
                context.success(data.resultatSaisieClient.client);
            } else {
                var msg;
                context.userError(msg);
            }
        };
    };

    CX.Transformers.searchUserAndSaveFromInscription = function($scope, options) {
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

    CX.Transformers.searchUserAndSaveFromDetail = function($scope, options) {
        var res = {
            "clientNumber":  $scope.reference,
            "dateNaissance": $scope.birthDate,
            "prenom":                            null,
            "nom":                               null,
            "codePostal":                        null,
            "eMail":                             null,
            "codeProduit":                       null,
            "save":                              null,
            "update":                            1,
            "regroupementPrelevements":          null,
            "telephoneProfessionnel":            null,
            "telephoneFixe":                     null,
            "telephoneMobile":                   null,
            "codeCategorieSocioProfessionnelle": null,
            "reference":  $scope.reference,
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

    CX.Transformers.searchUserAndSaveFromVerification = function($scope, options) {
        var res = {
            "clientNumber":  $scope.reference,
            "dateNaissance": $scope.birthDate,
            "prenom":                           null,
            "nom":                              null,
            "codePostal":     $scope.postalCode,//                  null,
            "eMail":          $scope.mail,//                  null,
            "codeProduit":                       null,
            "save":                              null,
            "update":                            1,
            "regroupementPrelevements":          null,
            "telephoneProfessionnel":            null,
            "telephoneFixe":        $scope.phone,//             null,
            "telephoneMobile":      $scope.mobil ,//             null,
            "codeCategorieSocioProfessionnelle": null,
            "reference": $scope.reference,
            "sollicitationAutresProduits":       null,
            "bureauDistributeur":  $scope.city.label, //              null,
            "donneesCommunicables":              null,
            "ligne3":         $scope.street1 || "",//                   null,
            "ligne2":         $scope.street2 || "",//                   null,
            "ligne1":         $scope.ligne1 || "",//                   null,
            "codeInseeCommune":                  null,
            "pays":                $scope.country,//              null,
            "ligne4":         $scope.ligne4 || "",
            "dateEffet":    "",//                     null,
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
    CX.Model.prototype.createUserSel = function(success, userError, parameters, options){
        this.routeName;
        this.success = success;
        this.userError = userError;
        this.parameters = parameters;
        this.options = options;
    };
    CX.Model.prototype.createUserSel.prototype = CX.extending(CX.Model.prototype.IO.prototype);
    CX.Model.prototype.createUserSel.prototype.routeName = "createUserSel";
    CX.Model.prototype.createUserSel.prototype.formatParameter = function(parameters, options) {
        var res = {
            "fos_user_registration_form": {
                "email": parameters.email,
                "plainPassword": {
                    "first":  parameters.password,
                    "second": parameters.password
                }
            },
            "recaptcha_challenge_field" :  CX.secretCaptcha,
            "recaptcha_response_field": parameters.response,
            "reference": parameters.reference
        };

        return res;
    };

    /*----------------renewConfirmationEmail---------------------------------------------------------*/
    CX.Model.prototype.renewConfirmationEmail = function(success, userError, parameters, options){
        this.routeName;
        this.success = success;
        this.userError = userError;
        this.parameters = parameters;
        this.options = options;
    };
    CX.Model.prototype.renewConfirmationEmail.prototype = CX.extending(CX.Model.prototype.IO.prototype);
    CX.Model.prototype.renewConfirmationEmail.prototype.routeName = "renewConfirmationEmail";
    CX.Model.prototype.renewConfirmationEmail.prototype.formatParameter = function(parameters, options) {
        var res = {
                "email": parameters.email
        };

        return res;
    };

    CX.Model.prototype.createUserSel.prototype.parseResponse = function(context){
        return function(data, status, headers, config, statusText) {
            if (data) {
                context.success(data);
            } else {
                var msg;
                context.userError(msg);
            }
        };
    };

    CX.Transformers.createUserSelFromInscription = function($scope, options) {
        var res = {
            "email":     CX.emailCompte,
            "password":  $scope.password,
            "response":  $scope.captchaResponse,
            "reference": $scope.reference
        };
        return res;
    };

    // (lv) : create userSel depuis la page de choix multiple  - casPayeur -
    CX.Transformers.createUserSelFromMultiple = function(userSig) {

        var res = {
            "email":     CX.emailCompte,
            "password":  CX.searchUserSigModel.password,
            "response":  CX.searchUserSigModel.captchaResponse,
            "reference": userSig.reference
        };
        return res;

    };
}
/*----------isUserSel---------------------------------------------------------------------------*/
{
    CX.Model.prototype.isUserSel = function(success, userError, parameters, options){
        this.routeName;
        this.success = success;
        this.userError = userError;
        this.parameters = parameters;
        this.options = options;
    };
    CX.Model.prototype.isUserSel.prototype = CX.extending(CX.Model.prototype.IO.prototype);
    CX.Model.prototype.isUserSel.prototype.routeName = "isUserSel";
    CX.Model.prototype.isUserSel.prototype.formatParameter = function(parameters, options) {
        var res = {
            "email": parameters.email,
            "reference": parameters.reference
        };
        return res;
    };
    CX.Transformers.isUserSelFromInscription = function($scope, options) {
        var res = {
            "email":    $scope.mail,
            "reference":    $scope.reference
        };
        return res;
    };
}

/*----------getUserSel---------------------------------------------------------------------------*/
{
    CX.Model.prototype.getUserSel = function(success, userError, parameters, options){
        this.routeName;
        this.success = success;
        this.userError = userError;
        this.parameters = parameters;
        this.options = options;
    };
    CX.Model.prototype.getUserSel.prototype = CX.extending(CX.Model.prototype.IO.prototype);
    CX.Model.prototype.getUserSel.prototype.routeName = "getUserSel";

    CX.Model.prototype.getUserSel.prototype.formatParameter = function(parameters, options) {
        var res = {
            "email": parameters.email
        };
        res = parameters;
        return res;
    };

    CX.Model.prototype.createUserSel.prototype.parseResponse = function(context){
        return function(data, status, headers, config, statusText) {
            context.success(data);
        };
    };

    CX.Transformers.getUserSelFromInscription = function($scope, options) {
        var res = {
            "email":    $scope.mail
        };
        return res;
    };
}
/*----------searchUserSig---------------------------------------------------------------------------*/
{
    CX.Model.prototype.searchUserSig = function(success, userError, parameters, options){
        this.success = success;
        this.userError = userError;
        this.parameters = parameters;
        this.options = options;
        this.routeName = "searchUserSig";
    };
    CX.Model.prototype.searchUserSig.prototype = CX.extending(CX.Model.prototype.IO.prototype);
    CX.Model.prototype.searchUserSig.prototype.formatParameter = function(parameters, options) {
        var res = {
            clientNumber:    parameters.reference,//\D+ true        Numéro client://\D+ true        Numéro client,//SIG
            dateNaissance:   parameters.birthDate,//true        date de naissance du client
            prenom:          parameters.firstName,//\w+ true        prénom du client
            nom:             parameters.lastName,//\w+ true        nom du client client
            codePostal:      parameters.postalCode,//\D+ true        code postal du client
            eMail:           parameters.mail,//\w+ true        Email client
            telephoneMobile: parameters.mobil,//\D+ true        telephone Mobile
            reference:       parameters.reference,//\D+ false       numero client
            debug: 0,//\d+ false       Mode bouchon vide = config, 0 : non 1 oui
            captchaResponse: parameters.captchaResponse,
            verificationContract: parameters.verificationContract
        };
        return res;
    };

    CX.Model.prototype.searchUserSig.prototype.parseResponse = function(context){

        return function(data, status, headers, config, statusText) {
            if (data.erreur) {
                context.userError(data, status, headers, config, statusText);
                return;
            }
            if (!data.client || data.client.length == 0) {
                context.userError(data, status, headers, config, statusText);
                return;
            }

            CX.searchUserSigModel.userSigCollec = data.client;

            context.success(data, status, headers, config, statusText);
        };
    };


    CX.Transformers.searchUserSigFromDetail = function($scope, options) {
        var res = {
            reference:  $scope.reference,//\D+ true        Numéro client: null,//SIG
            birthDate:  $scope.birthDate,//true        date de naissance du client
            firstName:  $scope.firstName,//\w+ true        prénom du client
            lastName:   $scope.lastName,//\w+ true        nom du client client
            postalCode: $scope.postalCode,//\D+ true        code postal du client
            mail:  $scope.mail,//\w+ true        Email client
            mobil: $scope.mobile,//\D+ true        telephone Mobile
            //reference: null,//\D+ false       numero client
            debug: null,//\d+ false       Mode bouchon vide = config, 0 : non 1 oui
            verificationContract:1,
            captchaResponse: $scope.captchaResponse
        };
        return res;
    };

    CX.Transformers.searchUserSigFromInscription = function($scope, options) {
        var res = {
            reference:  $scope.reference,//\D+ true        Numéro client: null,//SIG
            birthDate:  $scope.birthDate,//true        date de naissance du client
            firstName:  "",//\w+ true        prénom du client
            lastName:   "",
            postalCode: "",
            mail:  "",
            mobil: "",
            verificationContract:1,
            captchaResponse: $scope.captchaResponse
        };
        return res;
    };

    CX.Transformers.searchUserSigFromVerification = function($scope, options) {
        var res = {
            reference:  $scope.reference,//\D+ true        Numéro client: null,//SIG
            birthDate:  $scope.dateOfBirth,//true        date de naissance du client
            firstName:  $scope.firstName,//\w+ true        prénom du client
            lastName:   $scope.lastName,//\w+ true        nom du client client
            postalCode: $scope.postalCode,//\D+ true        code postal du client
            mail:  $scope.mail,//\w+ true        Email client
            mobil: $scope.mobile,//\D+ true        telephone Mobile
            //reference: null,//\D+ false       numero client
            debug: 0,//\d+ false       Mode bouchon vide = config, 0 : non 1 oui
            verificationContract: 0
        };
        return res;
    };
}
/*----------updateUserSig-------------------------------------------------------------------*/
// {
//     CX.Model.prototype.updateUserSig = function(success, userError, parameters, options){
//         this.success = success;
//         this.userError = userError;
//         this.parameters = parameters;
//         this.options = options;
//         this.routeName = "updateUserSig";
//     };
//     CX.Model.prototype.updateUserSig.prototype = CX.extending(CX.Model.prototype.IO.prototype);
//     CX.Model.prototype.updateUserSig.prototype.formatParameter = function(parameters, options) {
//         var res = {
//             "fos_user_update_form": {
//                 "email": parameters.email
//             },
//             "reference": parameters.reference
//         };
//         return res;
//     };
//     CX.Transformers.updateUserSigFromDetail = function($scope, options) {
//         var res = {
//             reference: $scope.reference,//\D+ true        Numéro client: null,//SIG
//             birthDate: $scope.birthDate,//true        date de naissance du client
//             firstName: $scope.firstName,//\w+ true        prénom du client
//             lastName: $scope.lastName,//\w+ true        nom du client client
//             postalCode: $scope.postalCode,//\D+ true        code postal du client
//             email: $scope.mail,//\w+ true        Email client
//             mobil: $scope.mobil,//\D+ true        telephone Mobile
//             //reference: null,//\D+ false       numero client
//             debug: null//\d+ false       Mode bouchon vide = config, 0 : non 1 oui
//         };
//         return res;
//     };

// }
/*----------updateUserAddressSel------------------------------------------------------------------*/
{
    CX.Model.prototype.updateUserAddressSel = function(success, userError, parameters, options){
        this.success = success;
        this.userError = userError;
        this.parameters = parameters;
        this.options = options;
        this.routeName = "updateUserAddressSel";
    };
    CX.Model.prototype.updateUserAddressSel.prototype = CX.extending(CX.Model.prototype.IO.prototype);
    CX.Model.prototype.updateUserAddressSel.prototype.formatParameter = function(parameters, options) {
        var res = {
            "street1":     parameters.street1,
            "street2":     parameters.street2,
            "ligne1":     parameters.ligne1,
            "ligne4":     parameters.ligne4,
            "city":        parameters.city,
            "zip":         parameters.postalCode,
            "country":     parameters.country,
            "phoneNumber": parameters.mobil,
            "phoneFix":    parameters.phone,
            "reference":   parameters.reference,
            "codeInseeCommune":   parameters.codeInseeCommune
        };
        return res;
    };
    CX.Model.prototype.updateUserAddressSel.prototype.parseResponse = function(context){
        return function(data, status, headers, config, statusText) {

            if (data.code != undefined && data.code == "0" && data.message != undefined && data.message == "Success") {
                context.success(data.code, data.message);
            } else {
                context.userError(data.code, data.message);
            }
        };
    };
    CX.Transformers.updateUserAddressSelFromVerification = function($scope, options) {
        var res = {
            "street1":    $scope.street1,
            "street2":    $scope.street2,
            "ligne1":     $scope.ligne1,
            "ligne4":     $scope.ligne4,
            "city":       $scope.city.bureauDistributeur,
            "postalCode": $scope.postalCode,
            "country":    $scope.country,
            "mobil":      $scope.mobil,
            "phone":      $scope.phone,
            "reference":  $scope.reference,
            "codeInseeCommune":  $scope.codeInseeCommune
        };
        return res;
    };
}
/*--------getUserSigByReference-----------------------------------------------------------------------------*/
{
    CX.Model.prototype.getUserSigByReference = function(success, userError, parameters, options){
        this.success = success;
        this.userError = userError;
        this.parameters = parameters;
        this.options = options;
        this.routeName = "getUserSigByReference";
    };
    CX.Model.prototype.getUserSigByReference.prototype = CX.extending(CX.Model.prototype.IO.prototype);
    CX.Model.prototype.getUserSigByReference.prototype.formatParameter = function(parameters, options) {
        var res = {
            "clientNumber": parameters.reference,
            "debug": null
        };
        return res;
    };
    CX.Model.prototype.getUserSigByReference.prototype.parseResponse = function(context){
        return function(data, status, headers, config, statusText) {
            var finalResponse = {};
            // parse data
            // use options
            if (data.resultatClient && data.resultatClient.client) {
                var client = data.resultatClient.client;
                var userSig = {
                    "street1":     client.adresse.ligne3 || '',
                    "street2":    client.adresse.ligne2 || '',
                    "ligne1":     client.adresse.ligne1 || '',
                    "ligne4":     client.adresse.ligne4 || '',
                    "postalCode": client.adresse.codePostal || '',
                    "country":    client.adresse.pays || '',
                    "npai":       client.adresse.nPAI || '',
                    "city":       client.adresse.bureauDistributeur || '',
                    "codeInseeCommune":       client.adresse.codeInseeCommune || '',

                    "mobil": client.telephoneMobile || '',
                    "phone": client.adresse.telephone || '',
                    "mail":  client.eMail || '',

                    "prefix":    client.civilite || '',
                    "lastName":  client.nom || '',
                    "firstName": client.prenom || '',
                    "birthDate": client.dateNaissance || '',
                    "title": client.title || '',

                    "dataSharing":   client.donneesCommunicables || '',
                    "stateLabel":    client.libelleEtat || '',
                    "groupPay":      client.regroupementPrelevements || '',
                    "otherProducts": client.sollicitationAutresProduits || ''
                };
                var city = client.adresse;
                city.label = city.bureauDistributeur;
                city.libelle = city.label;


                context.success(userSig, city);
            } else {
                var msg;
                context.userError(msg);
            }
        };
    };

    CX.Transformers.getUserSigByReferenceFromVerification = function($scope, options) {
        var res = {
            "reference":  $scope.reference
        };
        return res;
    };
}

/*--------getCities-----------------------------------------------------------------------------*/
{
    CX.Model.prototype.getCities = function(success, userError, parameters, options){
        this.success = success;
        this.userError = userError;
        this.parameters = parameters;
        this.options = options;
        this.routeName = "getCities";
    };
    CX.Model.prototype.getCities.prototype = CX.extending(CX.Model.prototype.IO.prototype);
    CX.Model.prototype.getCities.prototype.formatParameter = function(parameters, options) {
        var res = {
            "codePostal": parameters.postalCode,
            "debug": null
        };
        return res;
    };
    CX.Model.prototype.getCities.prototype.parseResponse = function(context){
        return function(data, status, headers, config, statusText) {
            if (data.messageAnomalie || !data.resultatCommunes.communes) {
                context.userError("erreur serveur");
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

            var cityDetail = {};
                cityDetail.codePostal = cities[0].codePostal;
                cityDetail.codeInsee = cities[0].codeInsee;
                cityDetail.bureauDistributeur = cities[0].bureauDistributeur;
                cityDetail.city = cities[0].libelle;

            context.success(cityDetail, cities);
        };
    };
    CX.Transformers.getCitiesFromVerification = function($scope, options) {
        var res = {
            "postalCode":  $scope.postalCode
        };
        return res;
    };
}
/*--------getUserSel-----------------------------------------------------------------------------*/
{
    CX.Model.prototype.getUserSel = function(success, userError, parameters, options){
        this.success = success;
        this.userError = userError;
        this.parameters = parameters;
        this.options = options;
        this.routeName = "getUserSel";
    };
    CX.Model.prototype.getUserSel.prototype = CX.extending(CX.Model.prototype.IO.prototype);
    CX.Model.prototype.getUserSel.prototype.formatParameter = function(parameters, options) {
        var res = {
            "email": parameters.mail,
            "debug": null
        };
        return res;
    };
    CX.Model.prototype.getUserSel.prototype.parseResponse = function(context){
        return function(data, status, headers, config, statusText) {
                context.success(data);
        };
    };
    CX.Transformers.getUserSelFromCoordonnees = function($scope, options) {
        var res = {
            "mail":  $scope.mail
        };
        return res;
    };
}
  /*----------updateUserSel-------------------------------------------------------------------*/
  {
      CX.Model.prototype.updateUserSel = function(success, userError, parameters, options){
          this.success = success;
          this.userError = userError;
          this.parameters = parameters;
          this.options = options;
          this.routeName = "updateUserSel";
      };

      CX.Model.prototype.updateUserSel.prototype = CX.extending(CX.Model.prototype.IO.prototype);
      CX.Model.prototype.updateUserSel.prototype.formatParameter = function(parameters, options) {
          var res = {
              "email": parameters.email,
              "reference": parameters.reference
          };
          return res;
      };

      CX.Transformers.updateUserSelFromDetail = function($scope, options) {
          var res = {
              reference: $scope.reference,//\D+ true        Numéro client: null,//SIG
              email: $scope.mail,//\w+ true        Email client
          };
          if(!res.reference || ! res.email){
              throw new Exception("email ou reference manquant.");
          }
          return res;
      };


      // (lv)
      CX.Transformers.updateUserSelFromMultiple = function(userSig) {
          var res = {
              reference: userSig.reference,//\D+ true        Numéro client: null,//SIG
              email: CX.searchUserSigModel.email,//\w+ true        Email client
          };
          if(!res.reference || ! res.email){
              throw new Exception("email ou reference manquant.");
          }
          return res;
      };



  }
