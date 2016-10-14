angular.module("SAV").service("Title",[
    'initData', 'lang',
    function(initData, lang) {
        var titles = {
            "fr" : {
                "perte_vol_declaration":       "Déclarer la perte/vol de ma carte",
                "perte_vol_verification_coordonnees":    "Vos coordonnées",
                "perte_vol_confirmation":   "Confirmation",
                "perte_vol_moyen_de_paiement":       "Paiement",
                "perte_vol_erreur" : "Déclarer la perte/vol de ma carte",

                "attestation":    "Obtenir mon attestation de forfait",
                "Profil":         "Client Existant ?",
                "Porteur":        "Vos coordonnées",
                "Photo":          "Photo",
                "Recapitulatif":  "Récapitulatif",
                "Identification": "Identification",
                "Detail": "Rattachement Données complémentaires",
                "Forfait": "Rattachement - Cas Payeur - Séléction du forfait",
                "Service": "Contacter service client",
                "Dedi": "Rattachement non autorisé",

                "end": ""
                //
            },
           "en" : {
               "attestation":    "Obtenir mon attestation de forfait",
                "Profil":         "Client Existant ?",
                "Porteur":        "Vos coordonnées",
                "Coordonnees":    "Vos coordonnées",
                "Paiement":       "Paiement",
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

        return titles[lang];
    }
]);
