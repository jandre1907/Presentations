(function () {
    "use strict";

    angular.module("SAV")
        .constant("ApiSigCourrier", {

            attestation: {
                route: "rest/sig/liste/attestation.json",
                method: "GET"
            }
        })
})();
