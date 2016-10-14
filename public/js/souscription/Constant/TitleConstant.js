angular.module("Souscription").service("Title",[
    'lang',  'Wording',
    function(lang, Wording) {
        var titles = {
            "fr" : {
                "Profil":         Wording.get('sna.sna_profil.titre_etape'),
                "Forfait":        Wording.get('sna.sna_forfait.titre_etape'),
                "Porteur":        Wording.get('sna.sna_coordonnees_porteur.titre_etape'),
                "Photo":          Wording.get('sna.sna_photo.titre_etape'),
                "Paiement":       Wording.get('sna.sna_paiement.titre_etape'),
                "Recapitulatif":  Wording.get('sna.sna_recapitulatif.titre_etape'),
                "Signature":      Wording.get('sna.sna_signature_porteur.titre_etape'),
                "Confirmation":   Wording.get('sna.sna_confirmation_porteur.titre_etape'),

                "Identification":      Wording.get('rat.rat_identification.titre_etape'),
                "IdentificationSuite": Wording.get('rat.rat_details.titre_etape'),
                "IdentificationFin":   Wording.get('rat.rat_choix_identite.titre_etape'),
                "IdentificationHelp":  Wording.get('rat.rat_aide.titre_etape'),
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
            }
        };

        return titles[lang];
    }
]);