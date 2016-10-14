angular.module("Rattachement").factory("rattachementSearch",[
    '$http', '$q', '$log', '$rootScope',
    function($http, $q, $log, $rootScope) {

        var userParamsKey = [
            "clientNumber",
            "dateNaissance",
            "prenom",
            "nom",
            "codePostal",
            "eMail",
            "telephoneMobile",
            "verificationContract"
        ];

        var exclusionCase = { "Décédé" : true, "Exclu": true, "Doublon":true, "Inexistant":true };


        /**
         * check if userParams is a valid object
         *
         * @return boolean true of object has
         */
        var isValid = function(userParams) {
            var howManyKeys = 0;

            for (key in userParamsKey) {
                if (typeof userParams.key != undefined && typeof userParams.key != "" && typeof userParams.key != null) {
                    howManyKeys++;
                }
            }

            if (typeof userParams.verificationContract == "undefined" || howManyKeys == 1 /*&& VC ! undefined*/) {
                return false;
            }

            return Boolean(howManyKeys);
        }

        /**
         * filter valid user in an array of user sig
         * @param: array user sig collection
         *
         * @return array filtred user sig collection
         */
        var filterSigCollection = function(userSigCollection) {
            var res = [];
            for(var i = 0; i < userSigCollection.length; i++) {
                if (!exclusionCase[userSigCollection[i].libelleEtat]) {
                    res.push(userSigCollection[i]);
                }
            }

            return res;
        };

        /**
         * count number of sig account in collection
         * @callback success: userSig collection contains an uniqu element
         * @callback success param: userSig
         *
         * @callback error:   userSig collection contains more element
         * @callback success error: filtred user Sig Collection
         */
        var switchByUserSigCollectionLength = function(userSigCollection, callback, callbackEmpty) {
            if (userSigCollection.length == 0) {
                callbackEmpty("Il n'y a pas de client valide pour cette recherche");

                return false;
            } else {
                var res = filterSigCollection(userSigCollection);

                if (res.length == 0) {//no valid user in collection
                    return userSigCollection[0];
                }

                if(res.length > 1) {
                    callback(res);

                    return false;
                }

                if (res.length == 1) {

                    return res[0];
                }
            }

        };


        /**
         * check validity of user Sig account
         * @callback success: user sig is valid
         * @callback success param: user sig object
         *
         * @callback error:   user sig is D.E.D.I. doublon, exclu, dead, inexistant cf var exclusionCase
         * @callback error param: error message key
         */
        var checkUserSigValidity  = function(userSig, callback) {
            if(exclusionCase[userSig.libelleEtat]) {
                callback("CU-RAT-EC01-MSS_002");
                return false;

            } else {
                return userSig;
            }
        };

        /**
         * search all sig account by criteria userParams
         * @callback success: one or more has been found
         * @callback error:   server error or no account found
         */
        var searchUserSigAccount  = function(userParams) {
            var url = "rest/sig/searchClientAccountSig.json";

            var expose = $q.defer();

            $http
            .get(url, {"params": userParams})
            .success(
                function(data){
                    if(!data.client || !data.client.length) {
                        expose.reject({"message": "client not found", "code": "searchUserSigAccount"});
                        return;
                    }
                    expose.resolve(data.client);
                    return;
                }
            )
            .error(
                function(msg){
                    expose.reject({"message": msg, "code": "searchUserSigAccount"});
                    return;
                }
            );

            return expose.promise;
        };

        return  function(userParams, uniqSuccessCallback, multipleSuccessCallBack, searchFailCallback, DEDIFailCallback) {
                $log.log("rattachementSearch fatcory");

                if (!isValid(userParams)) {
                    return false;
                }
                $rootScope.$broadcast("sendRequest");
                searchUserSigAccount(userParams)
                .then(
                    function(data){
                        $rootScope.$broadcast("receiveResponse");

                        var userSig = switchByUserSigCollectionLength(data, multipleSuccessCallBack, searchFailCallback);
                        if(!userSig) {
                            return;
                        }

                        if(!checkUserSigValidity(userSig, DEDIFailCallback)){
                            return;
                        }

                        uniqSuccessCallback(userSig);
                    })
                .catch(
                    function(data) {
                        $rootScope.$broadcast("receiveResponse");
                        searchFailCallback(data);
                    }
                )

                return true;
        }
    }
]);