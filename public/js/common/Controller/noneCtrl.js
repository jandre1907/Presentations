angular.module("Common").controller('noneCtrl', [
    '$scope', '$location', '$log',
    function($scope, $location, $log) {

        $scope.location = $location;
        var vm = this;
        $scope.tabOpen = window.location.hash.split('#/')[1];
        $('.panel-group a').filter(function() {
            return $(this).attr('href') == '#' + $scope.tabOpen;
        }).click();

        $scope.controlHash = function(event) {

            var targetPanel = $(event.target).parent().parent().find('a').attr('href').split('#')[1];

            if ($scope.tabOpen != targetPanel) {
                $('.panel-group .open').removeClass('open');
            }

            if (window.location.hash != ""  && $scope.tabOpen == targetPanel) {
                event.preventDefault();
                window.location.hash= '';
                $scope.tabOpen = '';
            } else {
                $scope.tabOpen = targetPanel;
            }

        }

    }]);