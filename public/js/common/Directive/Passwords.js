angular.module("Common").directive("selPassword",[
    function() {
        var UPCASE_REGEXP = /^.*[A-Z]+.*$/;
        var INTEGER_REGEXP = /^.*[0-9]+.*$/;
        var LOWERCASE_REGEXP = /^.*[a-z]+.*$/;
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function(scope, elm, attrs, ctrl) {
                    ctrl.$validators.passwordFormat = function(modelValue, viewValue)
                    {
                        if (ctrl.$isEmpty(modelValue)) {
                            return true;
                        }
                        if (UPCASE_REGEXP.test(viewValue)
                            && LOWERCASE_REGEXP.test(viewValue)
                            && INTEGER_REGEXP.test(viewValue)) {

                            return true;
                        }
                        return false;
                    };

                if (attrs.brother) {
                    ctrl.$validators.passwordsEqual = function(modelValue, viewValue)
                    {
                        if (ctrl.$isEmpty(modelValue)) {
                            return true;
                        }

                        if (attrs.brother == modelValue) {
                            return true;
                        }

                        return false;
                    };

                }
            }
        };
    }
]);