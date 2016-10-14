angular.module("Common").directive("bindValue", [
"$parse",
function ($parse) {
    this.$parse = $parse;
    var vm = this;
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var attr = attrs.ngModel;
            var val = attrs.value;
            vm.$parse(attr).assign(scope, val);


            var fieldNameModelKey = attrs.fieldName;
            var elementName = attrs.name;

            if (!scope.fieldNames) {
              scope.fieldNames = {};
            }

            scope.fieldNames[fieldNameModelKey] = elementName;
        }
    };
}]);