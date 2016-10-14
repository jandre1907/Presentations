angular.module("Common").filter('phoneFilter', function() {
    var rxSuppress = new RegExp('([^0-9]*)([0-9]*)([^0-9]*)', 'gi');
    var rxAddSpace = new RegExp('([0-9]{2})', 'gi');
    return function(rawPhoneNumber) {

        if(!rawPhoneNumber) {

            return "";
        }

        var supressNonNumericChar = function(str){

            return str.replace(rxSuppress, '$2');
        }

        var addSpaceAfterTwoNumeric = function(str){

            return str.replace(rxAddSpace, ' $1');
        }

        var res = supressNonNumericChar(rawPhoneNumber);
        res = addSpaceAfterTwoNumeric(res);

        return res;
    }
})
.filter('phoneUnfilter', function() {
    var rxSuppress = new RegExp('([^0-9]*)([0-9]*)([^0-9]*)', 'gi');
    return function(rawPhoneNumber) {

        if(!rawPhoneNumber) {

            return "";
        }

        var supressNonNumericChar = function(str){

            return str.replace(rxSuppress, '$2');
        };

        return supressNonNumericChar(rawPhoneNumber);
    }
});