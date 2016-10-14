angular.module("Common").controller('IdentificationHelpCtrl',
        ['$scope', '$location', '$rootScope' , function ($scope, $location, $rootScope) {
    $scope.blocks = {1:false, 2:false, 3:false};
    this.blockNameNumber = {"collapseOne": 1, "collapseTwo":2, "collapseThree":3};
    var vm = this;
    
        
    $scope.toggle = function(blockId) {
        var isOpen = $scope.blocks[blockId] == true;
        for(var key  in $scope.blocks) {
            $scope.blocks[key] = false;
        }

        if (!isOpen) {
            $scope.blocks[blockId] = true;
        }
        $scope.$apply();
    }

    $scope.windowClose = function() {
        window.close();
    }
    $scope.gotoStep = function(stepName) {
        //SEL.MODEL.saveDataToCookie();
        $location.path(stepName);
    }
    
    setTimeout(function(){
        $rootScope.$broadcast("receiveResponse");
        if ($location.hash() == "") {
            $scope.toggle(1);
        } else {
            $scope.toggle(vm.blockNameNumber[$location.hash()]);
        }
    },500);
    
}]);
