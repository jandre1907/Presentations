if (typeof CMC == "undefined") {
    CMC = {};
}
CMC.Controllers.prototype.SpinCtrl = function ($rootScope, $scope, usSpinnerService) {

    $scope.spinneractive = false;


    function start() {

        if (!$scope.spinneractive) {
        	usSpinnerService.spin('spinner-1');
        }
    };

    function stop() {

        if ($scope.spinneractive) {
        	usSpinnerService.stop('spinner-1');
        }
    };

    function kill() {

        if ($scope.spinneractive) {
        	usSpinnerService.stop('spinner-1');
        }
    };

    var initCtrl = function() {

    	kill();

    }



  $scope.$on('$viewContentLoaded', function(event) {

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

/**************MODEL*********************************************************************************/
/************************************************************************************/
