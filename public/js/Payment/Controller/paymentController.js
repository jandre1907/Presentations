angular.module('payment').controller('PaymentController', function($scope) {

    var IBAN_FRANCE_FORMAT = /[a-zA-Z]{2}[0-9A-Z]{25}/;
    var BIC_FRANCE_FORMAT8 = /^\w{8}$/;
    var BIC_FRANCE_FORMAT11 = /\w{11}/;
    var bic_enabled = false;
    var iban_enabled = false;
    $scope.bic = null;

    $scope.ibanIsComplies = function() {
        var iban_number  = $scope.iban1 + $scope.iban2 + $scope.iban3 + $scope.iban4 + $scope.iban5 + $scope.iban6 + $scope.iban7;
        $scope.iban_number = $scope.iban1 + $scope.iban2 + $scope.iban3 + $scope.iban4 + $scope.iban5 + $scope.iban6 + $scope.iban7;
        if (iban_number != null && IBAN_FRANCE_FORMAT.test(iban_number)) {
            $scope.picType = 'check';
            $scope.displayStatus = true;
            iban_enabled = true;
            return true;
        }
        if ($scope.iban_number != null && $scope.iban_number != "") {
	        $scope.displayStatus = false;
	        $scope.picType = 'error';
	        // TODO : mettre les pictos align� puis gerer le picto Cross red qui s'affiche des le debut.
	        iban_enabled = false;
        }

        return false;
    };

    $scope.bicIsComplies = function() {
        if ($scope.bic != null && (BIC_FRANCE_FORMAT8.test($scope.bic) || BIC_FRANCE_FORMAT11.test($scope.bic)) ) {
            $scope.bic_enabled = true;
            $scope.bicPicType = "check";
            bic_enabled = true;
            return true;
        }
        if ($scope.bic != null && $scope.bic != "") {
	        $scope.bicPicType = "error";
	        $scope.bic_enabled = false;
	        bic_enabled = false;
        }

        return false;
    };

    $scope.changeFocus = function( e, element ) {
        var form = window.document.forms[0];

        var event;
        var target;
        var key;
        var keychar;

        if (window.event) {
             event = window.event;
             key = window.event.keyCode;
             target = event.srcElement;

        }
        else if (e) {
             event = e;
             key = event.which;
             target = event.target;
        }

        var pend = $scope.getSelectionEnd(target);

        // Si l'on vient de tabuler, ne pas modifier la position du focus
        if (key != 9)
       	 {
   		     if ( element == 'iban1' ){
   		    	 if (pend == 4){
   		    		form["rib[iban2]"].focus();
   		         }
   		     } else if ( element == 'iban2' ){
   		         if (pend == 4){
   		        	form["rib[iban3]"].focus();
   		         }
   		     } else if ( element == 'iban3' ){
   		         if (pend == 4){
   		        	form["rib[iban4]"].focus();
   		         }
   		     } else if ( element == 'iban4' ){
   		         if (pend == 4){
   		        	form["rib[iban5]"].focus();
   		         }
   		     } else if ( element == 'iban5' ){
   		         if (pend == 4){
   		        	form["rib[iban6]"].focus();
   		         }
   		     } else if ( element == 'iban6' ){
   		         if (pend == 4){
   		        	form["rib[iban7]"].focus();
   		         }
             }
       	 }
     };

    $scope.buttonIsEnabled = function() {
        if (bic_enabled && iban_enabled && $scope.checkbox_declaration) {
            return false;
        }

        return true;
    };


    $scope.getSelectionEnd = function( o ) {
        if ( typeof o.selectionEnd != 'undefined' )
            return o.selectionEnd;

        // IE And FF Support
        o.focus();
        var range = o.createTextRange();
        range.moveToBookmark(document.selection.createRange().getBookmark());
        range.moveStart('character', - o.value.length);
        return range.text.length;
    };

});
