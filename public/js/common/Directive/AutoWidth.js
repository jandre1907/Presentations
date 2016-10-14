angular.module("Common").directive("autoWidth", [
"$parse", "$log",
function ($parse, $log, $window) {

    var vm = this;
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.autoWidth = {};
            scope.autoWidth.parentSelector = angular.fromJson(attrs.autoWidth).parentSelector;
            scope.autoWidth.parentTabletSelector = angular.fromJson(attrs.autoWidth).parentTabletSelector || angular.fromJson(attrs.autoWidth).parentSelector;
            scope.autoWidth.listLength = angular.fromJson(attrs.autoWidth).listLength || scope.stepLength;
            scope.autoWidth.currentStep = angular.fromJson(attrs.autoWidth).currentStep || scope.currentStep;

            var resizeMe = function() {
                    scope.autoWidth.listLength = scope.stepLength || scope.autoWidth.listLength;
                    scope.autoWidth.currentStep = scope.currentStep || scope.autoWidth.currentStep;

                    scope.referentWidth = $(scope.autoWidth.parentSelector).width();// - (scope.autoWidth.listLength % 2 == 0 ? 2 : 0);
                    if (scope.referentWidth > 991) {
                        scope.parentWidth = $(scope.autoWidth.parentTabletSelector).width();
                    } else {
                        scope.parentWidth = scope.referentWidth;
                    }

                    $('#box_nav_step_sub_menu > ol').width(scope.parentWidth);
                    scope.itemWidth = scope.parentWidth / scope.autoWidth.listLength;
                    scope.barWidth =   100 / scope.autoWidth.listLength * scope.autoWidth.currentStep + "%";
                    scope.itemWidth += "px";
                    // try{

                    //     scope.$apply();
                    // } catch(e) {
                    //     $log.log(e);
                    // }
            }

            if (scope.currentStep) {
                scope.$watch('currentStep', resizeMe);
            }

            $(window).on("resize",resizeMe);
            resizeMe();

        }
    };
}]);
                    //scope.autoWidth.currentStep = scope.autoWidth.currentStep || scope.currentStep;