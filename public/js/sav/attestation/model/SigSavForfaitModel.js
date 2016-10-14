(function () {
    "use strict";

    angular.module("SAV")
        .factory("SigSavForfaitModel", [
            "$q", "Resource", "ApiSigActesSav",
            function ($q, Resource, ApiSigActesSav) {
                var o = {};
                //---   MODEL DATA
                o.isForfaits = false;
                o.collection = [];

                //---------------------------------------
                //---   METHODS

                // - GET-FORFAIT :
                o.getForfait = function (sigRef) {

                    var params = {
                        numeroClient: sigRef
                    };
                    var defer = $q.defer();

                    Resource.do(ApiSigActesSav.ClientForfait, params)
                        .then(function (response) {
                            // pas de forfait associé a l'utilisateur
                            if(response.data.contrats.length === 0 || response.data == null) {
                                o.isForfaits = false;
                            }
                            else {
                                o.isForfaits = true;

                                // Passe tous les forfaits dans une unique collection :
                                _.each(response.data.contrats, function(forfaitCollec){
                                    _.each(forfaitCollec, function(forfait){
                                        o.collection.push(forfait);
                                    })
                                })
                            }
                            defer.resolve(o.collection);
                        },
                        // Fail :
                        function (err) {
                            // console.log(":: Allo erreur ");
                            defer.reject(err);
                        });

                    return defer.promise;

                };

                return o;
            }
        ])
})();

