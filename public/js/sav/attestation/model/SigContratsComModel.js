(function(){
    "use strict";

    angular.module("SAV")
        .factory("SigContratsComModel",[
            "$q", "Resource", "ApiSigContratsCom", "$location",
            function($q, Resource, ApiSigContratsCom , $location){

                var o = {};

                //---   MODEL DATA
                o.fakePdfUrl = "";
                o.contratPdfUrl = "";

                //---------------------------------------
                //---   METHODS :

                // - GET-ATTESTATION :
                o.getAttestation= function (refContrat) {

                    // TODO : (LV) Attention , API SIG pour les pdf avec Débug a 1
                    // pas encore etablie

                    var params = {
                        refContrat: refContrat,
                        debug: 1
                    };

                    var defer = $q.defer();

                    Resource.do(ApiSigContratsCom.attestation, params)
                        .then(function (response) {

                            // TODO : (LV) Attention retourne une fake URL
                            var domain  =  $location.host();
                            var port    =  $location.port();
                            if(port == "" || port == null || port == undefined ){
                                port = "";
                            }
                            else {
                                port = ":"+port;
                            }

                            var fakeUrl = "http://" + domain + port + "/front/uploads/testAttestation.pdf";
                            o.fakePdfUrl = fakeUrl;

                            defer.resolve(o.fakePdfUrl);
                        },
                        // Fail :
                        function (err) {
                            defer.reject(err);
                        });

                    return defer.promise;
                };

                //---------------------------------------

                return o;

            }])
})();
