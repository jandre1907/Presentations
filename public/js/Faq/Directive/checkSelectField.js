faqMod.directive('ngDirAreaNotEmpty', function() {

    //var FORMAT = /[a-z]+@[a-z]+\.[a-z]{2,3}/
    return {
        $scope: {},
        require: "ngModel",
        restrict: 'A',
        link: function(scope, elements, attrs, ctrl) {
            scope.valid = false;
        }
    }
});