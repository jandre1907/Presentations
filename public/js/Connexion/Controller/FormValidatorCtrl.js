angular.module('connexion').controller('FormValidatorCtrl', [
    '$scope', '$log',
    function($scope, $log) {    
        
        var vm = this;
    
        var setCaptchaResponse = function (response) {
            $log.log(response);
            $scope.form1.$setValidity('captcha', response);
            $scope.$apply();
        };
    
        var captchaExpired = function (response) {
            $scope.form1.$setValidity('captcha', false);
            $scope.$apply();
        };
    
        vm.retry = function() {
            try {
                if (vm.captchaId) {
                    grecaptcha.reset(vm.captchaId);
                }
    
                $scope.form1.$setValidity('captcha', false);
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
        vm.retry();
    
        $log.log($scope.form1);
    }]);



