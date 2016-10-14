angular.module("connexion").directive("ngPasswordConnect",[
    function() {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function(scope, elm, attrs, ctrl) {
                    ctrl.$validators.passField = function(modelValue, viewValue) {
                    if (ctrl.$isEmpty(modelValue)) {
                        return false;
                    }
                    return true;
                };
            }
        };
    }
]);