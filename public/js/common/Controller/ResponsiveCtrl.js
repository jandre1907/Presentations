angular.module('Common').controller('ResponsiveCtrl',[
'$scope', '$rootScope',

function($scope, $rootScope) {

    $scope.$on('$viewContentLoaded', function(next, current) {
        window.scrollTo(0,0);

//      $(window).responsive(); //nav_step_open_close.js

        $(window).navStep(); //nav_step_open_close.js

        $(window).dropDownStepBar(); // nav_step_open_close.js

        $(window).tooltip(); // tools.js

        //$(window).widthInputBirtdate(); // tools.js

    });
    
    //''3'',''telecharger_attestation_pdf'',''T''
    $scope.xt_click = function(s2click, p, clic) {
        rn = (new Date()).getTime();
        $rootScope.xt_click_params = {s2click: s2click, p: p, clic: clic, rn: rn};
    }

}]);
