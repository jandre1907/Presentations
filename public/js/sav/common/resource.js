(function () {
    "use strict";

    angular.module("SAV")
        .factory("Resource", [
            "$http",
            function ($http) {
                var resource = {};

                resource.do = function (apiModel, params) {

                    return $http({
                        method: apiModel.method,
                        url: apiModel.route,
                        params: params
                    });
                };

                return resource;
            }
        ])
})();
