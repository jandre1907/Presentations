angular.module("Resetting", [ "Common" ]);
angular.module("Resetting").controller("ResettingConfirmationCtrl",
[ "$scope", "$http", "$log",
function($scope, $http, $log)
{
    $scope.gotoStep = function(stepName, options)
    {
        $scope.formSubmitted = true;
        if ($scope.email) {
            var url = SEL.prefix_front + "api/resetConfirmationEmail.json";
            $http.post(url, {
                "email" : $scope.email
            }, null).success(success).error(error);
        }
    };

    var success = function(data)
    {
        $("#infos_renew").modal();
    };

    var error = function() {};
}
]);