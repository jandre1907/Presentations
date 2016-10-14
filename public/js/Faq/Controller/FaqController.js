faqMod.controller('FaqController', [
    '$scope',
    function($scope) {
        $scope.errorPicto = false;
        $scope.sectionPicto = false;
        $scope.descriptionPicto = false;
        $scope.requestPicto = false;

        $scope.isChecked = function(boolVar) {
            $scope.errorPicto = boolVar;
        }
        //---- Manage FAQ formulary motif field
        $scope.motifIsValid = function() {
            if ($scope.motifField) {
                $scope.errorPicto = true;
            } else {
                $scope.errorPicto = false;
            }
        }
        // ---- Manage the area checked picture ----
        $scope.areaIsValid = function() {
            if ($scope.askContentArea) {
                $scope.areaValid = true;
            } else {
                $scope.areaValid = false;
            }
        };
        // ---- Manage area valid description field for technic question ----
        $scope.descriptionIsValid = function() {
            if ($scope.descritptionField) {
                $scope.descriptionValid = true;
            } else {
                $scope.descriptionValid = false;
            }
        };
        // ---- Control all fields of FAQ formulary ----
        $scope.reportInvalidField = function($event) {
            if ( !($scope.areaValid
                    && $scope.motifField
                    && $scope.forfaitField
                ) && !($scope.motifField
                    && $scope.rubriqueField
                    && $scope.descritptionField
            )) {
                checkBadField();
                stopSubmit($event);
            }
        };
        // ---- check which is(are) the bad field(s) ----
        function checkBadField() {
            var badFields = [];
            if (!$scope.areaValid) {
                $scope.requestErrorPicto = true;
            } else {
                $scope.requestErrorPicto = false;
            }
            if (!$scope.motifField) {
                $scope.objectErrorPicto = true;
            } else {
                $scope.objectErrorPicto = false;
            }
            if (!$scope.forfaitField) {
                $scope.packageErrorPicto = true;
            } else {
                $scope.packageErrorPicto = false;
            }
            if (!$scope.rubriqueField) {
                $scope.sectionErrorPicto = true;
            } else {
                $scope.sectionErrorPicto = false;
            }
            if (!$scope.descriptionValid) {
                $scope.descriptionErrorPicto = true;
            } else {
                $scope.descriptionErrorPicto = false;
            }
            return badFields;
        }
        // ---- Stop the form submit ----
        function stopSubmit($event) {
            $event.preventDefault();
            $event.stopPropagation();
        };



    }]);