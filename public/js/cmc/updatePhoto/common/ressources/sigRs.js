(function(){
    "use strict";

    angular.module("updatePhoto")
        .factory("sigRs",[
        "$http",
        function($http){

            var ressource = {};

            //-------------------------
            // - GET_CLIENT BY NUMBER -
            ressource.get_clientByNumber = function(clientNumber) {
                return $http.get(
                    "rest/sig/clientbynumber.json"
                    ,{params:{clientNumber:clientNumber}}
                )
            };

            return ressource;
        }])
})();
