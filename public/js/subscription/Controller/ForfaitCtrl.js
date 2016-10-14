angular.module("Subscription").controller("ForfaitCtrl", ["$log", "$scope", function ($log, $scope) {

    var vm = this;

    $scope.error = '';
    var displayTooEarlyMessage = function () {
        $scope.error = 'SNA-FOR-EC01-MSS_001';
        $scope.$emit('tagIdentificationErrorEvent');
    }

    var hideErrorMessage = function () {
        $scope.error = '';
    }

    $scope.selectDateBefore17 = function(event) {
        if ($scope.startDate == $scope.dateIndex1 && SEL.dateDay >= 17) {
            displayTooEarlyMessage();
            return false;
        }

        hideErrorMessage();

        return true;
    }

    $scope.sendTagForm = function(event)
    {
        var element = $(event.currentTarget);

        $log.log("profil tagForm");
        //send event
        $scope.$emit("tagFormEvent", {
            "form": {
                "debut_forfait": ($scope.startDate == $scope.dateIndex1) ? 1 : 2,
                "zones": $scope.forfait,
            },
            "callback": function() {
                element.click();
            }
        });
    };

    $scope.forfaitSubmit = function(event)
    {
        if(!$scope.selectDateBefore17()) {
            event.stopPropagation();
            event.preventDefault();

            return;
        }

        //$scope.sendTagForm(event);
    }


    $log.log($scope.step_form);

}])

