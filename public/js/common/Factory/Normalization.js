/**
 * Normalization
 *
 * <pre>
 * Julien 19/11/15 Création
 * </pre>
 * @author Julien
 * @version 1.0
 * @package SelBundle
 */


/**
 * Angular service initialization
 */
angular.module("Common").factory(
    'Normalization',
    [
        '$http',
        '$rootScope',
        '$q',
        function($http, $rootScope, $q) {
            /**
             * Constructor
             *
             * @constructor
             */
            function Normalization()
            {
                // ==== Constructor ====
            } // Normalization
            Normalization.prototype = {
                /**
                 * Manage address normalization api call
                 *
                 * @param afterNormalizationCallback required, user function after normalization
                 * @param fallActionCallback optional, user function called when user cancel or normalization return an error
                 * @param serviceErrorCallback required, user function when http error append
                 */
                normalizeAddress : function(
                    $scope,
                    afterNormalizationCallback,
                    serviceErrorCallback,
                    addressDataMapper,
                    data,
                    cancelNormalizationCallback
                ) {
                    Normalization.prototype.addressNormalizedDeferer = $q.defer();
                    Normalization.prototype._scope = $scope;
                    Normalization.prototype._addressDataMapper = addressDataMapper;
                    Normalization.prototype._bindAddressNormalizationPopinClicks();
                    Normalization.prototype._callAddressNormalization(
                        addressDataMapper.line3(),
                        addressDataMapper.line2(),
                        addressDataMapper.line1(),
                        addressDataMapper.zipCode(),
                        addressDataMapper.distributionOffice(),
                        addressDataMapper.cityInseeCode(),
                        addressDataMapper.line4(),
                        addressDataMapper.country(),
                        data
                    ); // normalizeAddress

                    Normalization.prototype.addressNormalizedDeferer.promise.then(
                        function(next) {
                            if (!next) {
                                if(typeof cancelNormalizationCallback == "function") {
                                    cancelNormalizationCallback(Normalization.prototype.error);
                                }
                                return;
                            }
                            afterNormalizationCallback();
                        },
                        function() {
                            serviceErrorCallback();
                        }
                    );
                }, // normalizeAddress

                /**
                 * Set onClick methods of address normalisation popin
                 * as attributes of the scope object
                 *
                 * @private
                 */
                _bindAddressNormalizationPopinClicks : function()
                {
                    /**
                     * Resolve the address normalization promise when the
                     * popin is validated (with boolean parameter 'true')
                     */
                    Normalization.prototype._scope.onClickAddressNormalizationPopinValidate = function() {
                        Normalization.prototype.addressNormalizedDeferer.resolve(true);
                    };

                    /**
                     * Resolve the address normalization promise when the
                     * popin is canceled (with boolean parameter 'false')
                     */
                    Normalization.prototype._scope.onClickAddressNormalizationPopinCancel = function() {
                        Normalization.prototype.addressNormalizedDeferer.resolve(false);
                    };
                }, // _bindAddressNormalizationPopinClicks

                /**
                 * Call server side action that perform the address normalization
                 *
                 * @private
                 */
                _callAddressNormalization : function(
                    line3,
                    line2,
                    line1,
                    zipCode,
                    distributionOffice,
                    cityInseeCode,
                    line4,
                    country,
                    data
                ) {
                    if (data && data.action) {
                        Normalization.prototype._callAddressNormalizationSuccess(data);
                        return;
                    }
                    var parameters = {
                        "ligne3":             line3,
                        "ligne2":             line2,
                        "ligne1":             line1,
                        "codePostal":         zipCode,
                        "bureauDistributeur": distributionOffice,
                        "codeInseeCommune":   cityInseeCode,
                        "pays":               country,
                        "ligne4":             line4
                    };
                    var url = window.SEL.prefix_front + "rest/normalize_address";
                    $rootScope.$broadcast("sendRequest");
                    $http
                        .get(url, {params: parameters})
                        .success(
                            function(data) {
                                $rootScope.$broadcast("receiveResponse");
                                Normalization.prototype._callAddressNormalizationSuccess(data.normalizedAddress);
                            }
                        )
                        .error(
                            function(data) {
                                $rootScope.$broadcast("receiveResponse");
                                Normalization.prototype._callAddressNormalizationError(data.normalizedAddress);
                            }
                        );
                }, // _callAddressNormalization

                /**
                 * Success callback function of address normalization promise that
                 * manage the http ok return of the server (status 200) regarding
                 * the content of the response
                 *
                 * @private
                 * @param response
                 */
                _callAddressNormalizationSuccess : function(response)
                {
                    if (!response) {
                            Normalization.prototype._scope.error = "Addresse incorrect";
                            Normalization.prototype.error = response.error.message;
                            Normalization.prototype.addressNormalizedDeferer.resolve(false);
                            return;
                    }

                    switch (response.error.action) {
                        case "error":
                            Normalization.prototype._scope.error = response.error.message;
                            Normalization.prototype.error = response.error.message;
                            Normalization.prototype.addressNormalizedDeferer.resolve(false);
                            break;
                        case "popin":
                            if (response.address) {
                                Normalization.prototype._scope.normalizedAddress = response.address;
                            }
                            Normalization.prototype._scope.error = "";
                            Normalization.prototype.error = "";
                            Normalization.prototype._hydrateScope();
                            Normalization.prototype._displayAddressNormalizationPopin(response.error.message);
                            break;
                        default:
                            if (response.address) {
                                Normalization.prototype._scope.normalizedAddress = response.address;
                            }
                            Normalization.prototype._hydrateScope();
                            Normalization.prototype.addressNormalizedDeferer.resolve(true);
                    }
                }, // _callAddressNormalizationSuccess

                /**
                 * Error callback function of address normalization promise that
                 * reject the promise if an http error is rise by the server
                 *
                 * @private
                 * @param response
                 */
                _callAddressNormalizationError : function(response) {
                    Normalization.prototype.addressNormalizedDeferer.reject();
                }, // _callAddressNormalization

                /**
                 * Hydrate current scope with normalized address
                 * data using addressDataMapper
                 *
                 * @private
                 */
                _hydrateScope : function() {
                    var addressDataMapper = Normalization.prototype._addressDataMapper;
                    for (var key in addressDataMapper) {
                        if (addressDataMapper.hasOwnProperty(key)) {
                            if (key != 'fullComplement') {
                                addressDataMapper[key](Normalization.prototype._scope.normalizedAddress[key]);
                            } else {
                                addressDataMapper[key](
                                    Normalization.prototype._scope.normalizedAddress.line2.trim(),
                                    Normalization.prototype._scope.normalizedAddress.line1.trim(),
                                    Normalization.prototype._scope.normalizedAddress.line4.trim()
                                );
                            }
                        }
                    }
                },

                /**
                 * Manage address normalization error message
                 * displaying into a popin
                 *
                 * @private
                 * @param message
                 * @param address
                 */
                _displayAddressNormalizationPopin : function(message) {
                    Normalization.prototype._scope.popin = true;
                    Normalization.prototype._scope.errorMessage = message;
                    $("#sModal").modal();
                }, // _displayAddressNormalizationPopin

                /**
                 * Mapper needed to reinject returned normalized data
                 * into the current scope for which parameters names
                 * can be different from those used in this class.
                 */
                _addressDataMapper : {},

                /**
                 * Local reference to Angular $scope object
                 */
                _scope : null,

                /**
                 * Token de fin
                 */
                _endPrototype : null,

                error: ""
            }; // Normalization.prototype

            return new Normalization();
        }
    ]
);
