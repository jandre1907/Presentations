(function () {
    "use strict";

    angular.module("SAV")
        .factory("SigClientModel", [
            function () {
                var o = {};

                //-------- sig --------------
                o.model = {
                    prenom: null,
                    nom: null,
                    reference: null,
                    codeCategorieSocioProfessionnelle: null,
                    regroupementPrelevements: null,
                    donneesCommunicables: null,
                    libelleEtat: null,
                    sollicitationAutresProduits: true,
                    adresse: {
                        bureauDistributeur: null,
                        codePostal: null,
                        ligne3: null,
                        ligne2: null,
                        ligne1: null,
                        nPAI: false,
                        codeInseeCommune: null,
                        locale: true,
                        dateDebut: null,
                        pays: null,
                        resultatNormalisation: null
                    }
                };

                //---------- METHODS------------------






                return o;
            }
        ])

})();
