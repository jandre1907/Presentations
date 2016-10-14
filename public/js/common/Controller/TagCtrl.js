angular.module("Common").controller('TagCtrl', [
'$scope', '$rootScope', '$location', '$log', '$http', 'initData',
function($scope, $rootScope, $location, $log, $http, initData) {
    $scope.url="#";
    $scope.urlClic="#";

    var evaluateData = function(parseExpression)
    {
        var parseOn = parseExpression.split('.');
        var subsection = initData;
        for (var i=0; i<parseOn.length; i++) {
            subsection = subsection[parseOn[i]];
        }

        return subsection;
    }

    function getUseCase()
    {
        if (!initData.contrat || !initData.contrat[0]) {
            return null;
        }

        if (initData.contrat[0].nameProduit == "Navigo Annuel") {
            return  "NA";
        }

        if (!initData.contrat[0].contratCadre) {
            return  "IR_sans_tiers_payantchoix1";
        }

        if (initData.contrat[0].contratCadre
            && initData.contrat[0].contratCadre.codeChoixGestion != 1
        ) {
            return "IR_tiers_payant_choix234";
        }

        if (initData.contrat[0].contratCadre
            && initData.contrat[0].contratCadre.codeChoixGestion == 1
        ) {
            return "IR_tiers_payant_choix1";
        }

        return null;
    }

    var methods = new (function()
    {
        this.getError = function()
        {
            $log.log("getError");
            if (!$scope.pages.parse) {
                $scope.xt_page = "";
                return;
            }

            var subsection = evaluateData($scope.pages.parse);
            $scope.xt_page = $scope.pages.prefix + subsection;
        };

        this.getType = function()
        {
            var type = getUseCase();
            if (!type) {
                $scope.xt_page = "";
                return;
            }

            $scope.xt_page = $scope.pages[type].xt_page;

        }

        this.direct = function()
        {
            if (!$scope.pages['xtpage']) {
                $scope.xt_page = "";
                return;
            }

            $scope.xt_page = $scope.pages['xtpage'];
        }
    })();

    $scope.$watch(
        'pages', function(newVal) {
        $log.log(initData);
        $log.log($scope.pages);
        try {
            methods[$scope.pages.methodName]();

            window.xtsite =  $scope.xtsite;
            window.xtn2 =    $scope.xtn2;
            window.xt_multc = $scope.xt_mult;
            window.xt_ac =   $scope.xt_ac;
            window.xt_an =   $scope.xt_an;
            window.xt_page = $scope.xt_page;

            $scope.url = window.xtsd + '.xiti.com/hit.xiti?s=' + $scope.xtsite
                + '&s2=' + $scope.xtn2
                + '&p=' + $scope.xt_page
                + '&vrn=1' + $scope.xt_multc
                + '&ac=' + $scope.xt_ac
                + '&an=' + $scope.xt_an
                + '&lng=fr'
                + '&idp=' + $scope.sessionId
                + '&ref=' +$scope.referer;

            $rootScope.tagUrl = $scope.url;
        } catch(e) {
            $log.log(e);
            $scope.url = "#";
        }

    });

    $scope.$watch(function ()
        {
            if (!$rootScope.xt_click_params) {
                $rootScope.xt_click_params = {rn: 0};
            }
            return $rootScope.xt_click_params.rn;
        },
        function(newVal)
        {
            if (!newVal || !$scope.xt_page) {
                return;
            }

            $log.log($rootScope.xt_click_params);
            try {
                var dt = new Date($rootScope.xt_click_params.rn);

                $scope.urlClic = window.xtsd + '.xiti.com/hit.xiti?s=' + $scope.xtsite +
                    '&s2=' + $scope.xtn2 +
                    '&p=' + $rootScope.xt_click_params.p +
                    '&clic=' + $rootScope.xt_click_params.clic +
                    '&vtag=4.6.4' +
                    '&hl=' + dt.getUTCHours() + 'x' + dt.getUTCMinutes() + 'x' + dt.getUTCSeconds() +
                    '&r=' + screen.width + 'x' + screen.height + 'x' + screen.colorDepth + 'x' + screen.colorDepth +
                    '&rn=' + Math.floor($rootScope.xt_click_params.rn / 1000) +
                    '&pclick=' + $scope.xt_page +
                    '&s2click=' + $rootScope.xt_click_params.s2click;
            } catch(e) {
                $log.log(e);
                $scope.urlClic = '#';
            }
        }
    );
}]);

/************************Block dev******/
 angular.module('Common').controller('tagBlockCtrl', function($scope, $rootScope){
    $scope.symbole = 'X';
    $scope.open = true;

    $scope.toggle = function() {
       $scope.open = !$scope.open;
       $scope.symbole = $scope.open ? 'X':'^';
    };

    $scope.$watch(function(){
            return $rootScope.tagUrl;
        },
        function(newVal) {
            $scope.url = $rootScope.tagUrl

        })
 });