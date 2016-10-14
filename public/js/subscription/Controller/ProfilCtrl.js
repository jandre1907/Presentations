angular.module("Subscription").controller("ProfilCtrl", ["$log", "$scope", function ($log, $scope) {

    var vm = this;

    var setCaptchaResponse = function (response) {
        $log.log(response);
        $scope.captchaResponse = response;
        $scope.$apply();
    };

    var captchaExpired = function (response) {
        $scope.captchaResponse = false;
        $scope.$apply();
    };

    vm.retry = function() {
        try {
            if (vm.captchaId) {
                grecaptcha.reset(vm.captchaId);
            }

            vm.captchaId = grecaptcha.render('g-recaptcha', {
                'sitekey': $scope.secretCaptcha,
                'callback': setCaptchaResponse,
                'expired-callback': captchaExpired
            });
        } catch (e) {
            $log.log(e);
            setTimeout(vm.retry, 500);
        }
    }

    $scope.sendTagForm = function(event)
    {
        var element = $(event.currentTarget);

        $log.log("profil tagForm");
        //send event
        if ($scope.userInfo) {
            $scope.$emit("tagFormEvent", {
                "form": {
                    "sig": $scope.userInfo.hasCard,
                    "client": $scope.userInfo.isUser,
                },
                "callback": function() {
                    element.click();
                }
            });
        } else {
            element.click();
        }
    };

    $scope.$watch('clientQuestion', function(){
        if ($scope.clientQuestion) {
            vm.retry();
        }
    });

    $log.log($scope.step_form);

}])

