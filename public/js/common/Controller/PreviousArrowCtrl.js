angular.module("Common").controller('PreviousArrowCtrl', [
    '$window', '$scope',
    function($window, $scope) {
        var vm = this;
        var wherePreviousArrowIsHidden = {
            "/Profil": true,
            "/IdentificationHelp" : true
        };

        this.hide = false;

        $scope.$on('$routeChangeSuccess', function(next, current) {
            if (!current.$$route || !current.$$route.originalPath) {
                vm.hide = false;
                return;
            }
            var key = current.$$route.originalPath;
            vm.hide = wherePreviousArrowIsHidden[key] === true;
        })

        this.previousPage = function(key) {
            $window.history.back();
        };
    }]);