angular.module("Common").directive("gieMailOrRef",[
    function() {
        var MAIL_GIE_REGEXP = /^[\w+-]+(?:\.[\w+-]+)*@(?:[\w+-]+\.)+[a-zA-Z]{2,7}$/;
        var REF_GIE_REGEXP = /^[0-9]{1,10}$/;

        return {
            require: '?ngModel',
            restrict: '',
            link: function(scope, elm, attrs, ctrl) {

                ctrl.$validators.email = function(modelValue, viewValue)
                {
                    if (ctrl.$isEmpty(modelValue)) {
                        return true;
                    }

                    if (MAIL_GIE_REGEXP.test(viewValue) || REF_GIE_REGEXP.test(viewValue)) {
                        return true;
                    }

                    return false;
                }
            }
        };
    }
]);