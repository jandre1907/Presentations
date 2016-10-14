angular.module("Common").directive("documentTitle", [
"$parse", "$log",
function ($parse, $log) {

    var vm = this;
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $log.log(attrs);
            $log.log(attrs.documentTitle);
            window.document.title = attrs.documentTitle;
        }
    };
}]);