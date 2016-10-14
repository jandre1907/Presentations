angular.module("Common").directive("borderValidMobile", [
"$parse", "$log",
function ($parse, $log) {

    var vm = this;
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            var errorExpr = $(element).find("img.error").attr("ng-show");
            var validExpr = $(element).find("img.valid").attr("ng-show");

            var domInput = $(element).find("input") || $(element).find("select");

            scope.$watchGroup(
                [errorExpr, validExpr],
                function(newValue, oldvalue) {

                    $parse(errorExpr)(scope)
                        ? domInput.each(function(){
                            $(this).addClass("border-error");
                        })
                        : domInput.each(function(){
                            $(this).removeClass("border-error");
                        });

                    $parse(validExpr)(scope)
                        ? domInput.each(function(){
                            $(this).addClass("border-valid");
                        })
                        : domInput.each(function(){
                            $(this).removeClass("border-valid");
                        });
                }

            )



/*
            var attr = attrs.ngModel;
            var val = attrs.value;
            vm.$parse(attr).assign(scope, val);


            var fieldNameModelKey = attrs.fieldName;
            var elementName = attrs.name;

            if (!scope.fieldNames) {
              scope.fieldNames = {};
            }

            scope.fieldNames[fieldNameModelKey] = elementName;*/
        }
    };
}]);