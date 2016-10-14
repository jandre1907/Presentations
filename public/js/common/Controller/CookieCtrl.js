angular.module("Common").controller('CookieCtrl', [
'$scope', '$location',
function($scope, $location)
{
    $scope.selAcceptCookie = function()
    {
        return $.cookie("selAcceptCookie");
    };

    $scope.closeCookie = function()
    {
        $.cookie("selAcceptCookie", true, {"path": "/", "secure": true});
        $("#bandeau_cookie").fadeOut();
    };
}]);