CMC.app.service("Title",[
    'lang',
    function(lang) {
        var titles = {
            "fr" : {
                "Profil":         "Client Existant ?",
                "Forfait":        "Sélection du forfait",
                "Porteur":        "Vos coordonnées 1",
                "Photo":          "Photo",
                "Paiement":            "Paiement",
                "Recapitulatif":  "Récapitulatif",
                "Signature":      "Signature",
                "Confirmation":   "Confirmation",

                "Identification": "Identification",
                "IdentificationSuite": "Rattachement Données complémentaires",
                "IdentificationFin": "Rattachement Données complémentaires",
                "IdentificationHelp": "Rattachement Données complémentaires",

                "end": ""
                //
            },
           "en" : {
                "Profil":         "Client Existant ?",
                "Porteur":        "Vos coordonnées",
                "Coordonnees":    "Vos coordonnées",
                "Photo":          "Photo",
                "Recapitulatif":  "Récapitulatif",
                "Confirmation":   "Confirmation",
                "Identification": "Identification",
                "Detail": "Rattachement Données complémentaires",
                "Forfait": "Rattachement - Cas Payeur - Sélection du forfait",
                "Service": "Contacter service client",
                "Dedi": "Rattachement non autorisé",

                "end": ""
                //
            }
        };

        return titles[lang];
    }
]);