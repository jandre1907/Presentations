CMC.Controllers.prototype.MainCtrl = function($scope, $io, $location, $sce, $route, $routeParams, $compile, Upload, $q, $cookieStore) {
    $route.reload();
    $scope.showFirstPage = $location.path() == "/Formulaire";

};

CMC.Controllers.prototype.TitleCtrl = function($scope, $io, $location, $sce, $route, $routeParams, $compile, Upload, $q, $cookieStore) {
    CMC.log('TitleCtrl');
    var key = $location.path().substr(1);
    var self = this;
    self.title = CMC.TITLES[key];
    $scope.$on('$locationChangeSuccess', function(event) {
        CMC.log('TitleCtrl viewContentLoaded');
            var key = $location.path().substr(1);
            self.title = CMC.TITLES[key];

    });
};

CMC.Controllers.prototype.Throbber = function($rootScope, $scope) {
    this.count = 0;
    this.timer = null;
    this.show = false;
    var self = this;

    $scope.$on("sendRequest", start);
    $rootScope.$on("receiveResponse", stop);
    $rootScope.$on("receiveResponseError", stop);
    $scope.$on('$viewContentLoaded', function(event) {
        kill();
    });

    function start() {
        CMC.log("start");
        self.count ++;
        if(self.timer === null){
            self.timer = setTimeout(displayThrobber, 100);
        }
    };

    function stop() {
        CMC.log("stop");
        self.count--;
        if (self.count <= 0){
            hideThrobber();
        };
    };

    function kill() {
        CMC.log("kill");
        self.count = 0;
        hideThrobber();
    };

    function displayThrobber() {
        CMC.log("displayThrobber");
        self.show = true;
        window.clearTimeout(self.timer);
        self.timer = null;
    }

    function hideThrobber() {
        CMC.log("hideThrobber");
        self.show = false;
        window.clearTimeout(self.timer);
        self.timer = null;
    }

}