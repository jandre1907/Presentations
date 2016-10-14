(function(){
    "use strict";

    angular.module("SAV").controller("ErrorCtrl",[
        "SigClientModel", "SigSavForfaitModel", "$http", "$scope","$rootScope", "initData",
        function(SigClientModel, SigSavForfaitModel, $http, $scope, $rootScope, initData) {
            var vm = this;


            $rootScope.failPage = true;


            var BUTTON_MSG_TITLE = "RETOUR À MON ESPACE PERSONNEL";
            var BUTTON_MSG = "RETOUR À MON ESPACE PERSONNEL";
            var BUTTON_LOCATION = "espace_client";
            var BUTTON_PATH = "";
            vm.buttonPath = BUTTON_PATH;
            vm.buttonLocation = BUTTON_LOCATION;
            vm.buttonMessage = BUTTON_MSG;
            vm.buttonMessageTitle = BUTTON_MSG_TITLE;

            var commonError = {
                "SAV-P/V-NMS": true,
                "V-16A":       true,
                "V-LIM-EC01":  true,
                "V-LIM-EC02":  true,
                "NO_CONTRACT": true
            }
         
            var guessCase = function() {
                if (initData.typeError.error.length) {
                    $scope.passNumber = initData.refPass;
                    return initData.typeError.error;
                } else {

                    return 'NO_CONTRACT';
                }
            };

            this.stepSubmit = function() {
                if(vm.buttonPath) {
                    $location.path(vm.buttonPath);
                }

                if(vm.buttonLocation) {
                    window.location.hash = "";
                    window.location = vm.buttonLocation;
                }
            };

            var doCase = function() {
                if(commonError[guessCase()]) {
                    vm.meskey = guessCase();
                } else {
                    vm.meskey = 'SAV-P/V-NMS';
                }
            };

            doCase();

        }//end Controller
    ])
})();
