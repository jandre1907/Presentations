/**
 * ServerProcessError
 *
 * <pre>
 * Julien 07/12/15 Création
 * </pre>
 * @author Julien
 * @version 1.0
 * @package SelBundle
 */


/**
 * Angular service initialization
 */
angular.module("Common").factory(
    'ServerProcessError',
    [
        'Wording',
        function(Wording) {
            /**
             * Constructor
             *
             * @constructor
             */
            function ServerProcessError()
            {
                // ==== Constructor ====
            } // ServerProcessError
            ServerProcessError.prototype = {
                /**
                 * Manage process errors returned by the server
                 *
                 * @param response
                 */
                manage : function(data, successCallback, errorCallback, responseParser)
                {
                    if (typeof responseParser != 'undefined') {
                        var message = responseParser(data);
                    } else {
                        var message = ServerProcessError.prototype._parseResponse(data);
                    }
                    if (message == null) {
                        successCallback();
                    } else {
                        errorCallback(message);
                    }
                }, // manage

                /**
                 * Parse server response to determine which post-treatment has to be done
                 *
                 * @private
                 */
                _parseResponse : function(response)
                {
                    var message = null;
                    if (response.code != 'undefined') {
                        switch (response.code) {
                            case 400: {
                                var pattern1 = /^Request parameter/;
                                var pattern2 = /^The option "message"/;
                                if (response.message != 'undefined' && (pattern1.test(response.message) || pattern2.test(response.message))) {
                                    message = Wording.get("sna.sna_erreur.generic_form_field_input_error");
                                }
                                break;
                            }
                        }
                    }

                    return message;
                }, // _parseResponse

                /**
                 * Token de fin
                 */
                _endPrototype : null
            }; // ServerProcessError.prototype

            return new ServerProcessError();
        }
    ]
);
