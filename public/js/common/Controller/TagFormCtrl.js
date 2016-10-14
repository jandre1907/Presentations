angular.module("Common").controller('TagFormCtrl', [
    '$scope', '$location', '$log', '$rootScope',
    function($scope, $location, $log, $rootScope) {
        $scope.img = false;
        $scope.urlTagForm = "#";
        window.xtsite =  $scope.xtsite;
        window.xtn2 =    $scope.xtn2;
        window.xt_multc = $scope.xt_mult;
        window.xt_ac =   $scope.xt_ac;
        window.xt_an =   $scope.xt_an;
        window.xt_page = $scope.xt_page;
        /**
         * formData sample
         *-----------------
         * sig:
         *      1:
         *            f1: [Oui]
         *      0:
         *            f1: [Non]
         * client:
         *      1:
         *           f1: [Oui]
         *      0:
         *           f1: [Non]
         * data sample
         * -------------
         * {sig: true,
         * client: false}
         */
        $rootScope.$on("tagFormEvent", function(event, data) {
            try {
                $log.log("sending");
                var res = {};

                if (!$scope.xt_form) {
                    data.callback();
                    return;
                }
                for (var key in data.form) {
                    //          $scope.formData['sig'][1]
                    //          profil key:sig,subkey:1 => value : {f1: [Oui]}
                    var rawResult = $scope.xt_form[key][data.form[key]];

                    if (typeof rawResult != 'object') {
                        continue;
                    }

                    for (var finalKey in rawResult) {
                        res[finalKey] = rawResult[finalKey];
                    }
                }

                var fakeForm = (new function(){
                    this.submit = function(){};
                }());

                if (typeof window.xt_form != "function") {
                    window.xt_form = function(form, type, xtn2, form_name, N, resubmit, res) {
                        $scope.img = true;
                        var dt = new Date();
                        $scope.urlTagForm =  window.xtsd + ".xiti.com/hit.xiti?"
                        + "s=" + $scope.xtsite
                        + "&s2=" + xtn2
                        + "&p=" + form_name
                        + "&clic=" + N
                        + "&stc=" + encodeURIComponent(angular.toJson(res))
                        + "&vtag=4.6.4"
                        + '&hl=' + dt.getUTCHours() + 'x' + dt.getUTCMinutes() + 'x' + dt.getUTCSeconds()
                        + '&r=' + screen.width + 'x' + screen.height + 'x' + screen.colorDepth + 'x' + screen.colorDepth
                        + "&rn=" + Math.floor((new Date()).getTime()/1000)
                        + "&pclick="+ $scope.xt_page
                        + "&s2click=";
                    }
                }

                window.xt_form(fakeForm, 'C', $scope.xtn2, $scope.xt_page, 'N', false, res);
                data.callback();
            } catch(e) {
                $log.log(e);
            }
        });
    }
]);