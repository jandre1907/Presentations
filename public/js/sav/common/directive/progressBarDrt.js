(function () {
    "use strict";

    angular.module("SAV")
        .directive("progressBarDrt", [
            "$rootScope",
            "$location",
            "$log",
            function ($rootScope, $location, $log) {
                return {
                    restrict: 'E',
                    replace: true,
                    template: '<li ng-repeat="step in scalarData" ng-class="step.class" ng-style="{\'width\': itemWidth}">'
        +                        '<a class="link" href="{{step.link}}" title="{{step.label}}" ng-show="step.class==\'complete\'">'
        +                            '<span class="box_img">'
        +                                '<img ng-src="{{step.okPng}}" alt="Etape fini"/>'
        +                           '</span>'
        +                            '{{step.label}}'
        +                        '</a>'
        +                        '<span class="box_no_link" ng-hide="step.class==\'complete\'">{{step.label}}</span>'
        +                    '</li>',
                    scope: {
                        data: '='
                    },

                    // OLD
                    /*
                     *template: '<div class="container-fluid" ng-show="isProgress">'
+                                    '<div class="row">'
+                                        '<div class="col-xs-12">'
+                                            '<div class="row bs-wizard {{className}}">'

+                                                '<div class="bs-wizard-step {{ bootStrapColClass }}" ng-repeat="step in scalarData" ng-class="step.class" >'
+                                                   '<div class="text-left bs-wizard-stepnum"><span class="number">{{step.index}}</span> <span class="tiret">-</span>'
+                                                       '{{step.label}}'
+                                                   '</div>'
+                                                   '<div class="progress">'
+                                                       '<div class="progress-bar"></div>'
+                                                   '</div>'
+                                                   '<a href="{{step.link}}" class="bs-wizard-dot"></a>'
+                                               '</div>'

+                                           '</div>'
+                                       '</div>'
+                                   '</div>'
+                                '</div>',
                    scope: {
                        data: '='
                    },
                    */

                    link: function (scope, el, attrs) {


                        // class de la progressBar
                        scope.className = attrs.pbName;

                        // preogressBar visible ?
                        scope.isProgress = false;

                        //----------------------
                        // init
                        //----------------------
                        // var last_route = $location.path();
                        var current_route = $location.path();
                        var stepNum = Object.keys(scope.data).length;

                        // fixe la bonne largeur des bootstraps col :

                        // scope.bootStrapColClass = "col-xs-" + colDivision, "test"; // Obsolete

                        //----------------------
                        // active le lien vers la route courante, désactive les suivantes, et reach les précédentes
                        if (scope.data[current_route]) {
                            scope.isProgress = true;
                            $rootScope.currentStep = scope.data[current_route].index;
                            scope.data[current_route].class = 'selected';
                            scope.data[current_route].isReached = true;
                            scope.data[current_route].link = "#" + current_route;

                            //----------------------
                            // passe les autres dans l'etat voulue :
                            for (var routeObj in scope.data) {
                                // $log.log(":: routeObj ", routeObj);
                                // aprés
                                if (scope.data[routeObj].index > scope.data[current_route].index) {
                                    // $log.log(":: scope.data[routeObj] -> ", scope.data[routeObj]);
                                    scope.data[routeObj].class = 'disabled';
                                }
                                // avant
                                if (scope.data[routeObj].index < scope.data[current_route].index) {
                                    scope.data[routeObj].class = 'complete';
                                    scope.data[routeObj].isReached = true;
                                    scope.data[routeObj].link = "#" + routeObj;
                                }
                            }
                        }
                        else {
                            scope.isProgress = false;
                        }

                        $rootScope.$on('$locationChangeSuccess', function (event, next, nextParams) {


                            var current_route = $location.path();

                            if (scope.data[current_route]) {
                                scope.isProgress = true;
                                $rootScope.currentStep = scope.data[current_route].index;

                                // current step classe
                                scope.data[current_route].class = 'selected';
                                scope.data[current_route].isReached = true;
                                scope.data[current_route].link = "#" + current_route;

                                //----------------------
                                // passe les autres dans l'etat voulue :
                                for (var routeObj in scope.data) {
                                    // aprés
                                    if (scope.data[routeObj].index > scope.data[current_route].index) {

                                        scope.data[routeObj].class = 'disabled';
                                        if (scope.data[routeObj].isReached) {
                                            scope.data[routeObj].class = "";
                                        }
                                    }
                                    // avant
                                    if (scope.data[routeObj].index < scope.data[current_route].index) {
                                        scope.data[routeObj].class = 'complete';
                                    }
                                }
                            }
                            else{
                                scope.isProgress = false;
                            }
                            scope.scalarData = scalarize();

                            // last_route = current_route;
                        });
                        function scalarize(){
                            var scalarData = [];
                            var currentIndex = 1;
                            var okPng = SEL.prefix_front + 'bundles/sel/images/new/nav_picto_ok.png';
                            while (currentIndex <= stepNum) {
                                for (var key in scope.data) {
                                    if (scope.data[key].index == currentIndex) {
                                        scope.data[key].okPng = okPng;
                                        scalarData.push(scope.data[key]);
                                        currentIndex ++;
                                        break;
                                    }
                                }
                            }
                            $log.log(scalarData);

                            return scalarData;
                        }
                        scope.scalarData = scalarize();


                    }
                }
            }])
})();
