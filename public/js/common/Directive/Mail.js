angular.module("Common").directive("gieMail",[
    function() {
        var MAIL_GIE_REGEXP = /^[\w+-]+(?:\.[\w+-]+)*@(?:[\w+-]+\.)+[a-zA-Z]{2,7}$/;

        return {
            require: '?ngModel',
            restrict: '',
            link: function(scope, elm, attrs, ctrl) {

                ctrl.$validators.email = function(modelValue, viewValue)
                {
                    if (ctrl.$isEmpty(modelValue)) {
                        return true;
                    }

                    if (MAIL_GIE_REGEXP.test(viewValue)) {
                        return true;
                    }

                    return false;
                }
            }
        };
    }
]);