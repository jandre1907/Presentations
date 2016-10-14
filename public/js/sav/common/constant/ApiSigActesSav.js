(function () {
    "use strict";

    angular.module("SAV")
        .constant("ApiSigActesSav", {

            ClientForfait: {
                route: "api/sig/ClientForfait.json",
                method: "GET"
            },
            ForfaitPerteVol: {
                route: "api/sig/ForfaitPerteVol.json",
                method: "GET"
            }
        })
})();
