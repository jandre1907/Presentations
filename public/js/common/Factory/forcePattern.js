angular.module("Common").factory('forcePattern',
["$log",
function($log) {

    var service = function(pattern, fields, $scope) {
        this.fields = fields;
        this.pattern = pattern;
        this.start($scope);
    };

    // service.prototype.fields = [];
    // service.prototype.pattern = /^.*$/;

    service.prototype.setPattern = function(pattern)
    {
        this.pattern = pattern;
    };

    service.prototype.setFields = function(fields) {
        this.fields = fields;
    }

    /**
     * force a field to be filled uniquely by pattern
     * @param field formField
     * @param newValue current viewValue of the field
     * @param oldValue old viewValue of the field
     */
    service.prototype.forcePattern = function(field, newValue, oldValue)
    {
        var regex = this.pattern;

        if (!regex.test(newValue)) {
            field.$setViewValue(oldValue);
            field.$render();
        }
    }

    service.prototype.getFieldsHaveToForcePattern = function(index)
    {
        if (typeof index == "undefined") {
            return this.fields;
        }

        return this.fields[index];
    }

    service.prototype.getGetters = function() {
        var functions = []
        var obj = this;
        for (var i = 0; i < this.fields.length; i++) {
            functions.push(
                (function(index) {
                    var i = index;
                    return function(){
                        return obj.getFieldsHaveToForcePattern(i).$viewValue;
                    }
                })(i)
            );
        }
        return functions;
    };

    service.prototype.start = function($scope){
        var obj = this;
        $scope.$watchGroup(obj.getGetters(),
            function (newValues, oldValues, scope)
            {
                for (var index in newValues) {
                    var field = obj.fields[index];
                    var newValue = field.$isEmpty(newValues[index]) ? "" : newValues[index];
                    var oldValue = field.$isEmpty(oldValues[index]) ? "" : oldValues[index];
                    obj.forcePattern(field, newValue, oldValue);
                }
            }
        );
    }

    return function construct(pattern, fields, $scope) {
        new service(pattern, fields, $scope);
    }
}]);