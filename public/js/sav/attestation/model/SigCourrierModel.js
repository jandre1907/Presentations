(function(){
    "use strict";

    angular.module("SAV")
        .factory("SigCourrierModel",[
            "$log", "$q", "Resource", "ApiSigCourrier",
            function($log, $q, Resource, ApiSigCourrier){
                var o = {};
                //-------------------------
                //---   DATA :
                //-------------------------
                o.isContrats    = false;
                o.isAttestation = false;
                o.collection    = [];

                //-------------------------
                //---   METHODS :
                //-------------------------

                // retourne la liste des eventuels contrats par type :
                o.getContratCollection = function(refSig, codeProduit){

                    var params = {
                        refClient: refSig,
                        codeProduit: codeProduit
                    };

                    var defer = $q.defer();

                    Resource.do(ApiSigCourrier.attestation, params)
                        .then(function (response) {
                            $log.log("SigCourrierModel - getContratCollection - response OK");
                            if(response.data.length != 0)
                            {
                                o.isContrats = true;
                                o.collection = response.data;
                            }
                            else {
                                o.isContrats = false;
                            }
                            defer.resolve(response.data);
                        },
                        // Fail :
                        function (err) {
                            $log.log("SigCourrierModel - FAIL");
                            defer.reject(err);
                        });

                    return defer.promise;

                };


                // retourne l'URL du contrat -
                o.getContratPdfUrl = function(refClient, refContrat, codeProduit){

                    var params = {
                        refClient: refClient,
                        refContrat: refContrat,
                        codeProduit: codeProduit
                    };

                    var defer = $q.defer();

                    Resource.do(ApiSigCourrier.attestation, params)
                        .then(function (response) {

                            $log.log("SigCourrierModel - getContratPdfUrl - response OK");

                            // il peut arriver qu'il n'y ait pas d'attestations
                            // pour un contrat :
                            if(response.data.length == 0 ) {
                                o.isAttestation = false;
                                defer.resolve();
                            }else {
                                o.isAttestation = true;
                                defer.resolve(response.data[0]);
                            }

                        },
                        // Fail :
                        function (err) {
                            $log.log("SigCourrierModel - getContratPdfUrl - response OK");
                            defer.reject(err);
                        });

                    return defer.promise;

                };

                return o;
            }
        ])
})();
