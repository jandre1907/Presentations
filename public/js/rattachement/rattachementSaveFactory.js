angular.module("Rattachement").factory("rattachementSave",[
    '$http',
    function($http) {

        return {
            get: function() {

                return "save";
            }
        }
    }
]);