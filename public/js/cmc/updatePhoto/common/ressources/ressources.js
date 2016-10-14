(function(){
    "use strict";

    angular.module("updatePhoto")
        .service("ressources", [
            "$http",
            "$q",
            "userSigMod",
            "userSelMod",
            "apiMod",
            function($http, $q, userSigMod, userSelMod, apiMod ){

                    //-----------------
                    // GET
                    this.get = function(apiMethod) {
                        var defer = $q.defer();
                    }

                    //-----------------
                    // POST

                    //-----------------
                    // Affect-Param
                    function aftect_params(apiMethod){

                           switch (apiMethod.name){
                               case "getUserSigByReference":
                                   apiMethod.param.clientNumber = userSigMod.reference;
                                   break;
                           }
                    }




        }])



})();
