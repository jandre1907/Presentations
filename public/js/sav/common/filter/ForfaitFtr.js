(function () {
    "use strict";

    angular.module("SAV")

        //---------------------------------
        // Retourne le nom litteral du forfait
        .filter("forfaitName", [function () {

            return function (forfaitNum) {
                forfaitNum = parseInt(forfaitNum);
                var forfaitName = "";

                switch (forfaitNum) {
                    case 1:
                        forfaitName = "Imagine R scolaire";
                        break;

                    case 2:
                        forfaitName = "Imagine R étudiant";
                        break;

                    case 3:
                        forfaitName = "Navigo Mois Semaine";
                        break;

                    case 4:
                        forfaitName = "Navigo Annuel";
                        break;

                    case 41:
                        forfaitName = "Navigo Annuel";
                        break;

                    case 80:
                        forfaitName = "Améthyste";
                        break;

                    case 90:
                        forfaitName = "Gratuit";
                        break;

                    case 93:
                        forfaitName = "Solidaire";
                        break;
                }

                return forfaitName;
            }
        }])


        //---------------------------------
        // Retourne seulement l'année d'une date :
        .filter("forfaitYear", [function () {
            return function (date) {
                var dateBegin = moment(date);

                return  dateBegin.format("YYYY");
            }
        }])
})();
