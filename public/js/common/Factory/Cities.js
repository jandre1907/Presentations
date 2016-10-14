angular.module("Common").factory('Cities',
["$q", "$log", "$http", "$rootScope",
function($q, $log, $http, $rootScope) {
    cityService = {};

    var parserError = function(data)
    {
        if (data.messageAnomalie || !data.resultatCommunes.communes) {
            return {"msg":"erreur serveur logique", "data":data};
        }

        return {"msg":"erreur serveur reseau", "data":data};
    };

    var parserSuccess = function(data)
    {
        var cities = [];
        var data = data.data;
        if(typeof data.resultatCommunes.communes.length != "undefined") {
            for(var i=0; i < data.resultatCommunes.communes.length; i++) {
                var city = data.resultatCommunes.communes[i];
                cities.push(city);
                cities[i].label = city.libelle;
            }
        } else {
            var city = data.resultatCommunes.communes;
            if (!city) {
                throw new Exception('postal code unknown');
            }
            cities.push(city);
            cities[0].label = city.libelle;
        }

        return cities;
    };

    cityService.request = function(postalCode)
    {
        $rootScope.$broadcast("sendRequest");
        var expose = $q.defer();
        var params = {
            "codePostal": postalCode,
            "debug": 0
        };

        $http.get(
            SEL.prefix_front + 'rest/sig/cities/postal/code.json',
            {"params": params}
        )
        .then(
            function success(data) {
                $rootScope.$broadcast("receiveResponse");
                try {
                    var cities = parserSuccess(data);
                    expose.resolve(cities);
                } catch (e) {
                    expose.reject(e.message);
                }
            }
        ).catch(
            function error(data) {
                $rootScope.$broadcast("receiveResponse");
                var msg = parserError(data);
                expose.reject(msg);
            }
        );

        return expose.promise;
    };

    cityService.getCities  = function(successCities, errorCities, initCities, resetCities, field) {
        $log.log("getCities");
        try {

            if (field.$pristine) {
                initCities();

                return;
            }

            if (!field.$pristine
                && (!  field.$viewValue.length
                    || field.$viewValue.length < 5
                )
            ) {
                resetCities();

                return;
            }

        } catch(e) {
            $log.log(e);
            return;
        }

        cityService.request(field.$modelValue)
        .then(function(cities){
            successCities(cities);
        }).catch(function(msg){
            errorCities(msg);
        });
    };

    return cityService;
}]);