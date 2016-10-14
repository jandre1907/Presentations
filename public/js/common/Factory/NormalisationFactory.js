angular.module("Common").factory("normalisation",[
    '$http', '$q', '$log', '$rootScope',
    function($http, $q, $log, $rootScope) {

    

        return  function( resultatNormalisation, errorMessages ) {
                	var result = [];
                	result["msg"] =	"";
                	result["action"] =	"";
                	
                	switch ( resultatNormalisation + "" ) {
                	case "6":
                	case "7":
                	case "16":
                		result["msg"] =	errorMessages["NORM-MSS_001"];
                		result["action"] =	"popin";
                		break;
                	case "8":
                	case "10":
                	case "11":
                	case "13":
                	case "17":
                		result["msg"] =	errorMessages["NORM-MSS_002"];
                		result["action"] =	"popin";
                		break;
                	case "9":
                	case "12":
                	case "14":
                		result["msg"] =	errorMessages["NORM-MSS_003"];
                		result["action"] =	"popin";
                		break;
                	case "2":
                	case "3":
                	case "4":
                		result["msg"] =	errorMessages["NORM-ERR_004"];
                		result["action"] =	"error";
                		break;
                	case "5":
                	case "15":
                		result["msg"] =	"Erreur";
                		result["action"] =	"error";
                		break;
                		
                	}
                	return result;
                    
                }
    }
]);