angular.module("Common").controller('TitleCtrl', [
    '$scope', '$location','$route', 'Title',
    function($scope, $location, $route, Title) {

        var vm = this;
        this.setTitle = function(key) {
            var key = key || $location.path().substr(1);
            vm.title = Title[key];
        };

        this.setTitle();
        $scope.$on('$routeChangeSuccess', function(next, current) {
            if (!current.$$route) {
                return;
            }
            if($scope.documentTitle) {
                window.document.title = vm.documentTitle;
            }
            var key = current.$$route.originalPath.substr(1);
            vm.setTitle(key);
        })
    }]);
