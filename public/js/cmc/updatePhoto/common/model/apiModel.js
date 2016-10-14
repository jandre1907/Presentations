(function(){
    "user strict";

    angular.module("updatePhoto")
        .value("apiMod", {
            getUserSigByReference:{
                name:"getUserSigByReference",
                url:"rest/sig/clientbynumber.json",
                param:{
                    clientnumber:-1
                }
            }
        })
})();