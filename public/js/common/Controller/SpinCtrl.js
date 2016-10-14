angular.module('Common').controller('SpinCtrl', [
    '$scope', '$rootScope', 'usSpinnerService', '$log',
    function ($scope, $rootScope, usSpinnerService, $log) {
        $scope.spinneractive = false;

        function start() {
            $log.log("scope.spinneractive : start");
            if (!$scope.spinneractive) {
                usSpinnerService.spin('spinner-1');
            }
        };

        function stop() {
            $log.log("scope.spinneractive : stop" );
            if ($scope.spinneractive) {
                usSpinnerService.stop('spinner-1');
            }
        };

        function kill() {
            $log.log("scope.spinneractive : kill" );
            if ($scope.spinneractive) {
                usSpinnerService.stop('spinner-1');
            }
        };

        var initCtrl = function() {
            kill();
        }

        $scope.$on('$viewContentLoaded', function(event) {
            $log.log("SpinCtrl content loaded");
            initCtrl();
        });

        $scope.$on('us-spinner:spin', function(event, key) {
            $scope.spinneractive = true;
        });

        $scope.$on('us-spinner:stop', function(event, key) {
            $scope.spinneractive = false;
        });

        $rootScope.$on("sendRequest", start);
        $rootScope.$on("receiveResponse", stop);
        $rootScope.$on("receiveResponseError", stop);
    }
]);

/**************MODEL*********************************************************************************/
/************************************************************************************/
