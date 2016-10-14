if (typeof CMC == "undefined") {
    CMC = {};
}
CMC.dateValid = function(clientDay,clientMonth,clientYear) {

    var date       = new Date();
    var dateMonth  = date.getMonth();
    var dateYear   = date.getFullYear();
    var dateDay    = date.getDay();
    var age        = dateYear - clientYear;
    var bissextile = false;
    var dateInfos  = { typeIsValid : "true", fevrier : "true" , ageIsValid : "true", toYoung : "false", ndDayPerMonthIsValid:"true"};

    var compiledDate = new Date(clientYear + "-" + clientMonth + "-" + clientDay);
    var cdateYear   = compiledDate.getFullYear();
    var cdateMonth  = (compiledDate.getMonth() + 1) % 12 ;
    cdateMonth == 0 ? cdateMonth = 12 : cdateMonth; // ajout gilles 05 09 2015
    var cdateDay    = compiledDate.getDate();

    if (cdateDay == clientDay && cdateMonth == clientMonth &&  cdateYear == clientYear) {
        typeIsValid = true;

    //**************controle type donnéess utilisateur*********
        if (typeof clientDay != "undefined" && clientMonth < 13 && clientMonth > 0) {
    //******** gestion d'années bissextile pour fevrier*******
            if (clientMonth == 02 && clientDay > 28 ) {
                if (clientYear % 4   !== 0 ||
                    clientYear % 100 !== 0 ||
                    clientYear % 400 !== 0) {
                    dateInfos.fevrier = "false";
                }
            };
            if (dateInfos.fevrier == "true") {
        //********nombre de mois && nombre d'années***************
                ndDayForMonth = (new Date(Date.parse(((clientMonth % 12) + 1).toString() + "/01/" + clientYear) - 86400000)).getDate();
                if (clientDay > ndDayForMonth) {
                    dateInfos.ndDayPerMonthIsValid = "false";
                };
        //************controle de l'age****************************

                if (age > 200) {
                    dateInfos.ageIsValid = "false";
                }
                else if (age < 4){
                    dateInfos.toYoung = "true";
                }
            };
        }
    }
    else {
        dateInfos.typeIsValid = "false";
    };
    return dateInfos;
//type chiffre uniquement Day:int x 2,month:int x 2, year: int x 4
//controle 28,29,30,31 et année bisextile
//pas plus de 200ans
};