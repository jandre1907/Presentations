(function(){

    // Enregistre les étapes effectuées par l'utilisateur
    // Formulaire (porteur) : step = 1 ; Photo : step = 2; Confirmation : passe a la methode "processOrder" "CardOrderId".
    // Lors du premier appel le callback délivre la valeur de "CardOrderId", a rajouter en parametre pour
    // tous les nouveaux appel a cette méthode.

    angular.module("CMC")
        .factory("CrtOrUptCardOrderModel",[
            "$log", "$q", "$http", "$rootScope","$timeout",
            function($log, $q, $http, $rootScope, $timeout){

                var o = {};
                //-------------------------
                //---   DATA :
                //-------------------------
                o.cardOrderId   = CMC.objects.userInfo.cardOrderId;

                //-------------------------
                //---   METHODS :
                //------------------------
                o.loadStep = function(step, photoValid){

                    var defer = $q.defer();

                    //if (CMC.reprise) {
                    //    return defer.promise;
                    //}

                    var params = {
                        email:          CMC.objects.userSel.email,
                        CardOrderId:    o.cardOrderId,
                        step:           step,
                        photoValid:     photoValid,
                        prefix:         CMC.objects.userSig.prefix,
                        firstname:      CMC.objects.userSig.firstname,
                        lastname:       CMC.objects.userSig.lastname,
                        street:         CMC.objects.userSig.street3,
                        postcode:       CMC.objects.userSig.postalCode,
                        city:           CMC.objects.userSig.city.label,
                        telephone:      CMC.objects.userSig.mobile
                    };

                    $log.log("crtOrUptCardOrderModel - debug user :" , CMC.objects);
                    // Event Spinner :
                    $rootScope.$broadcast("sendRequest");

                    $http({
                        method: CMC.routes.createOrUpdateCardOrder.method,
                        url:    CMC.routes.createOrUpdateCardOrder.url,
                        data:   params
                    }).then(function(response){
                            // Event Spinner :
                            $rootScope.$broadcast("receiveResponse");

                            $log.log("crtOrUptCardOrderModel - response :" , response);

                            // OK
                            if (response.data.code == 200){
                                o.cardOrderId = response.data.cardOrderId;
                                CMC.objects.userInfo.cardOrderId = o.cardOrderId;
                                CMC.objects.userInfo.quoteId = response.data.quoteId;
                                defer.resolve("OK");
                            }

                            // Email User n'existe pas / ou probleme :
                            if (response.data.code == 100){
                                $log.log("CrtOrUptCardOrderModel - ERROR : code 100 " +  response.data.message);
                                defer.reject(response.data.message);
                            }
                        },
                        // FAIL
                        function(err){
                            // Event Spinner :
                            $rootScope.$broadcast("receiveResponseError");

                            $log.log("CrtOrUptCardOrderModel - ERROR : " +  err);
                            defer.reject(err);
                        });

                    return defer.promise;
                };

                return o;
            }])
})();
