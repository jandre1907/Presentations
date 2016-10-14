(function () {
    "use strict";

    angular.module("SAV")
        .constant("ApiSigContratsCom", {

            attestation: {
                route: "api/sig/attestation.json",
                method: "GET"
            }
        })
})();
