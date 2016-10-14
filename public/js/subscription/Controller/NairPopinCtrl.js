angular.module("Subscription").controller("NairPopinCtrl", ["$log", "$scope", function ($log, $scope) {

    var vm = this;
    $log.log($scope.step_form);
    $scope.show = true;
    $("#sModalNAIR").modal();

    var hidePopin = function() {
        $scope.show = false;
    }

    $scope.cancel = function() {
        hidePopin();
    }

    $scope.confirm = function() {
        hidePopin();
    }

}])