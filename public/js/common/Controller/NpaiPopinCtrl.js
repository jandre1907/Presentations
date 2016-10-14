angular.module("Common").controller("NpaiPopinCtrl", ["$log", "$scope", "$rootScope",
    function ($log, $scope, $rootScope) {

    $rootScope.displayNpaiPopin = function(confirmAction, cancelAction) {
        $scope.show = true;
        $scope.confirmAction = confirmAction;
        $scope.cancelAction = cancelAction;
    }

    var vm = this;
    $log.log($scope.step_form);
    $scope.$watch('show',function(newValue) {
        if (newValue) {
            $("#sModalNPAI").modal();
            $scope.show = false;
        }
    });

    if (typeof $scope.show == 'undefined') {
        $scope.show = false;
    }

    var hidePopin = function() {
        $scope.show = false;
    }

    $scope.cancel = function() {
        $scope.cancelAction && $scope.cancelAction();
        hidePopin();
    }

    $scope.confirm = function() {
       $scope.confirmAction & $scope.confirmAction();
        hidePopin();
    }
}])