angular.module("Common").directive("responsiveTooltip", [
"$parse", "$log",
function ($parse, $log) {

    var vm = this;
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            tooltips = $(element).find('.tooltip');

            if (!scope.tooltips) {
                scope.tooltips = {}
            }

            scope.tooltips[attrs.tooltipId] = tooltips;

            scope.tooltip = function(tooltipId) {
                if (!scope.tooltipState) {
                    scope.tooltipState = {}
                }

                scope.tooltipState[tooltipId] = !scope.tooltipState[tooltipId];

                scope.tooltips[tooltipId].each(function(){
                    scope.tooltipState[tooltipId]
                    ? $(this).show()
                    : $(this).hide();
                })
            }
        }
    };
}]);