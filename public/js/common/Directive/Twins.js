angular.module("Common").directive("twin",[
"$log",
function($log) {
    var $parse = $parse;
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, elm, attrs, ctrl)
        {
            this.scope = scope;
            var vm = this;
            scope.$watch(function()
                {
                    return attrs.twin;
                },
                function (newValue, oldValue)
                {
                    ctrl.$validate();
                }
            )
            ctrl.$validators.equality = function(modelValue, viewValue)
            {
                var twinValue = attrs.twin;

                var condition = (twinValue == modelValue);
                if (attrs.insensitive && typeof twinValue == "string" && typeof modelValue == "string") {

                    condition = (twinValue.toUpperCase() == modelValue.toUpperCase());
                }

                if (ctrl.$isEmpty(viewValue) || ctrl.$isEmpty(twinValue)) {
                    return true;
                }

                if (condition) {
                    return true;
                }

                return false;
            };
        }
    };
}]);