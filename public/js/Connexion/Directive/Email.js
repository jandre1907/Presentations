angular.module("connexion").directive("emailValidator",[

    function() {
        var EMAIL_FORMAT_REGEXP = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
        var NUM_CLIENT_FORMAT = /[0-9]{8,}/;
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$validators.mail = function(modelValue, viewValue) {
                    scope.formatNum = false;
                    if (EMAIL_FORMAT_REGEXP.test(viewValue)) {
                        scope.formatEmail = true;
                        return true;
                    }
                    if (NUM_CLIENT_FORMAT.test(viewValue)) {
                        scope.formatNum = true;
                        return true;
                    }

                    return false;
                };
            }
        };
    },
]);

