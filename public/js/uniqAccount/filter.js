if (typeof CX == "undefined") {
    CX = {};
    CX.Model = function(){}
}
// prend - 2000-05-28T00:00:00+02:00 (retour brut api SIG)
// retourne 28/05/2000

CX.Model.prototype.dateFormat = function() {
    return function(rawBirthDate) {

        if(!rawBirthDate) {

            return "";
        }

        return moment(rawBirthDate).format("DD/MM/YYYY");
    }
};