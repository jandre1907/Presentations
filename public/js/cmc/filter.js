CMC.Model.prototype.civiliteFtr = function() {

    return function(input){
        input = parseInt(input);
        if (input == 1) {

            return "Monsieur";
        }
        if (input == 2) {

            return "Madame";
        }
    }
};

// Donne ça : 10/10/1980 ... depuis l'objet userSig.birthDate = {day:[], mouth:[], year:[]}
CMC.Model.prototype.dateFormatStr = function() {
    return function(birthDate){
        return birthDate.day + "/" + birthDate.month + "/" + birthDate.year;
    }
};


// Donne ça : 10/10/1980 ... depuis l'objet date = "1959-06-02T00:00:00+01:00";
CMC.Model.prototype.dateFormatStrStandart = function() {
    return function(rawBirthDate) {

        if(!rawBirthDate) {
            return "";
        }
        return moment(rawBirthDate).format("DD/MM/YYYY");
    }
};