(function () {
    "use strict";

    angular.module("updatePhoto", ["ui.router", "ngFileUpload"])

        // CONTROLLER  - main
        .controller("UpdatePhotoCtrl", [
            function () {
            }])


        //----------------------
        // Config & Router
        .config([
            "$stateProvider",
            "$urlRouterProvider",
            function ($stateProvider, $urlRouterProvider) {
                $urlRouterProvider.otherwise("/incompletudePhoto");
                $stateProvider
                    //----------------
                    // HOME
                    .state("photo", {
                        url: "/incompletudePhoto",
                        controller: "PhotoCtrl as PhotoCtrl",
                        templateUrl: "cmc_photo.html"
                    })
            }])
})();
