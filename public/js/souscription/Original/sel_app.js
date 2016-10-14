/**
 * Protect window.console method calls, e.g. console is not defined on IE
 * unless dev tools are open, and IE doesn't define console.debug
 */
(function() {
    // Union of Chrome, Firefox, IE, Opera, and Safari console methods
    var methods = ["assert", "assert", "cd", "clear", "count", "countReset",
        "debug", "dir", "dirxml", "dirxml", "dirxml", "error", "error", "exception",
        "group", "group", "groupCollapsed", "groupCollapsed", "groupEnd", "info",
        "info", "log", "log", "markTimeline", "profile", "profileEnd", "profileEnd",
        "select", "table", "table", "time", "time", "timeEnd", "timeEnd", "timeEnd",
        "timeEnd", "timeEnd", "timeStamp", "timeline", "timelineEnd", "trace",
        "trace", "trace", "trace", "trace", "warn"];
    var length = methods.length;
    var console = (window.console = window.console || {});
    var method;
    var noop = function() {};
    while (length--) {
        method = methods[length];
        // define undefined methods as noops to prevent errors
        if (!console[method])
            console[method] = noop;
    }
})();
window.SEL = typeof SEL == "undefined" ? {} : SEL;

 /*********************************************************************************************************
 *  SEL App
 *********************************************************************************************************/
SEL.App = function(){

    this.alert = function(utext){
            alert(utext);
    };

    this.log = function(utext) {
        if (console && console.log){
            console.log("SEL.App");
            console.log(utext);
        } else {
            return function(){
                return true;
            };
        }
    };

    this.domain = "/";
};

SEL.App.prototype.formBuilderCtrl =function($scope, $compile, $element, $http, $sce){
    $scope.form = {"id":"trop top"};

    $scope.downloadForm = SEL.MODEL.downloadForm($http, $scope, $element, $compile, $sce);

    $scope.addFormView = SEL.VIEW.addFormView($scope, $compile, $element);

    $scope.gotoStep = SEL.APP.gotoStep($http, $scope, $element, $compile, $sce);
};

SEL.App.prototype.TestController =function($scope, $compile, $element, $http, $sce, $route, $location, $filter){
    SEL.provides.$scope = $scope;
    SEL.provides.$compile = $compile;
    SEL.provides.$http = $http;
    SEL.provides.$sce = $sce;
    SEL.provides.$route = $route;
    SEL.provides.$location = $location;
    SEL.provides.$element = $element;
    SEL.provides.$filter = $filter;

    $scope.urlette = '../bundles/sel/js/mockup/inscription.html';

    $scope.downloadTemplate = function(urlette) {
        var url = SEL.APP.domain + urlette;
        $http.get(url)
        .success(function(data, status, headers) {
            $scope.template = $sce.trustAsHtml(data);
        })
        .error(function(data, status) {
            SEL.APP.log(status);
        });
    };

    $scope.$on('$includeContentLoaded', function(event) {
        SEL.APP.log("content loaded");
        // $route.reload();
    });
};

SEL.App.prototype.gotoStep = function($http, $scope, $element, $compile, $sce) {
    return function(Step) {
        var currentStep = SEL.MODEL.processCurentStep();
        SEL.VIEW.hideStep(APP.Model.processPreviousStep(currentStep));
        SEL.VIEW.showStep(APP.Model.processPreviousStep(step));
    };
};

SEL.App.prototype.fall = function($location, fallInvalidSteps) {
    if(SEL.fall !== false) {
        for (key in fallInvalidSteps) {
            var fall = fallInvalidSteps[key];
            if(!SEL.HOLDER[key].valid) {
                $location.path(fall);
            }
        }
    }
};

SEL.App.prototype.renderForm = function($scope, $compile, step) {
    for (var line = 0; line < SEL.htmlForms[step].byPosition.length ; line ++) {
        var formAtStepLine = SEL.htmlForms[step].byPosition[line];
        for (var col = 0; col < formAtStepLine.length ; col ++) {
            var formAtStepLineCol = formAtStepLine[col];
            SEL.VIEW.appendView(
                $scope,
                $compile,
                angular.element(document.getElementById('form_step_' + step))
            )
            (formAtStepLineCol);
        }
    }
    SEL.VIEW.appendView(
        $scope,
        $compile,
        angular.element(document.getElementById('step_' + step))
    )
    (SEL.htmlForms[step + 'Button']);
};

SEL.updateProvides = function(services) {
    for (key in services) {
        SEL.provides[key] = services[key];
    }
};

SEL.App.prototype.HistoryCtrl = function($location, $scope) {
    var name = "HistoryCtrl";
    var previous = function() {
        var index = SEL.breadcrumb[$location.path()] || 1;
        var i = 0;
        var res = "souscription#/Profil";
        for ( var key in SEL.breadcrumb) {
            if (i == index - 1) {
                res = 'souscription#/' + key;
                break;
            }
            i++;
        }
        // $scope.state = 'souscription/#Profil';

        return res;
    };
    $scope.state = previous();

    $scope.$on('$routeChangeSuccess', function(next, current) {
        $scope.state = previous();
    });
};


SEL.App.prototype.BreadcrumbCtrl = function($location, $scope) {

    //$(window).dropDownStepBar();

    var name = "BreadcrumbCtrl";
    var hideBreadcrumbPages = [
                               "/Profil", "Profil",
                               "/Identification", "Identification",
                               "/IdentificationHelp", "IdentificationHelp",
                               "/IdentificationSuite", "IdentificationSuite",
                               "/IdentificationFin", "IdentificationFin",
                               "/echec_identification", "IdentificationFailure",
                               "/Confirmation", "Confirmation",
                               "/Confirmation2", "Confirmation",
                               "/Paiement2", "Paiement2",
                               "/Signature2", "Signature2"
                               ];
    $scope.hide = !( -1 == hideBreadcrumbPages.indexOf($location.path()) ) ;

    $scope.step = "/Profil";

    $scope.isActive = function(step)
    {
        //window.responsive();
        //window.dropDownStepBar();
        return $location.path() == step;
    };

    $scope.isComplete = function(step)
    {
        //window.responsive();
       // window.dropDownStepBar();
        return SEL.breadcrumb[step] < SEL.breadcrumb[$location.path()];
    };

    $scope.isDisabled = function(step)
    {
    	// SEL.APP.log(step);
        //window.responsive();
        //window.dropDownStepBar();
        return !SEL.HOLDER[step.substr(1).toLowerCase()].hasBeenReached
    };

    $scope.hasRightToGoTo= function(step)
    {
        return $scope.isComplete(step) ;
    };


    $scope.$on('$routeChangeStart', function(next, current) {
        var hideBreadcrumbPages = [
                                   "/Profil", "Profil",
                                   "/Identification", "Identification",
                                   "/IdentificationHelp", "IdentificationHelp",
                                   "/IdentificationSuite", "IdentificationSuite",
                                   "/IdentificationFin", "IdentificationFin",
                                   "/echec_identification", "IdentificationFailure",
                                   "/Confirmation", "Confirmation",
                                   "/Confirmation2", "Confirmation",
                                   "/Paiement2", "Paiement2",
                                   "/Signature2", "Signature2"
                                   ];
        $scope.hide = !( -1 == hideBreadcrumbPages.indexOf($location.path()) ) ;

        $scope.step = $location.path();
        $scope.currentStep = false;

    });

    $scope.test = function(){
        // SEL.APP.log(name);
        // SEL.APP.log($location.path());
    };
};

SEL.App.prototype.MainCtrl = function($scope, $route, $routeParams, $location, $cookieStore) {
    this.$route = $route;
    this.$location = $location;
    this.$routeParams = $routeParams;
  if (SEL.HOLDER.porteur.data) {
        SEL.HOLDER.porteur.data = SEL.MODEL.overwriteObject(SEL.HOLDER.porteur.data, SEL.MODEL.userDefault());
    } else {
        SEL.HOLDER.porteur.data =  SEL.MODEL.userDefault();
    }
    // SEL.MODEL.getDataFromCookie($cookieStore);

    $scope.reload = function(){
        SEL.APP.log("route reload");
        $route.reload();
    };

    $scope.goto = function(step) {

        $location.path(step);
    };
};