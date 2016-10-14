angular.module("SAV").controller('TitleCtrl', [
    '$scope', '$location', 'Title',
    function($scope, $location, Title) {
        var key = $location.path().substr(1);
        var vm = this;
        vm.title = Title[key];

        $scope.$on('$routeChangeSuccess', function(next, current) {
            if (!current.$$route) {
                return;
            }

            var key = current.$$route.originalPath.substr(1);
            vm.title = Title[key];
        })
    }]);