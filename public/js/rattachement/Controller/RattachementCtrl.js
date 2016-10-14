angular.module('Rattachement')
.controller('RattachementCtrl',[
'$scope', '$log',
function($scope, $log)
{
    $scope.emailFieldName,
    $scope.sigClientNumberFieldName,
    $scope.lastnameFieldName,
    $scope.firstnameFieldName,
    $scope.postalCodeFieldName,
    $scope.mobileFieldName,
    $scope.birthDayFieldName,
    $scope.birthMonthFieldName,
    $scope.birthYearFieldName;
    $scope.fake = "fake";

    $log.log($scope.form);

//// watch date and force number//////////////////////////////
    var getDateFieldsToWatch = function(index)
    {
        var dateFields = [
                $scope.form[$scope.birthDayFieldName],
                $scope.form[$scope.birthMonthFieldName],
                $scope.form[$scope.birthYearFieldName]
        ];

        if (typeof index == "undefined") {
            return dateFields;
        }

        return dateFields[index];
    }

    $scope.$watchGroup([
            function() { return getDateFieldsToWatch(0).$viewValue; },
            function() { return getDateFieldsToWatch(1).$viewValue; },
            function() { return getDateFieldsToWatch(2).$viewValue; }
        ],
        function (newValues, oldValues, scope)
        {
            var fields  = getDateFieldsToWatch();
            for (index in newValues) {
                var field = fields[index];
                var newValue = field.$isEmpty(newValues[index]) ? "" : newValues[index];
                var oldValue = field.$isEmpty(oldValues[index]) ? "" : oldValues[index];
                forceNumber(field, newValue, oldValue);
            }

           $scope.form[$scope.birthDayFieldName].$setValidity('date', $scope.isDatePermitted());
        }
    );
//////////////////////////////////////////////////////////////////

/////////// watch sig client number and force it to be number ///////////////////////////////
    $scope.$watch(
        function() {
            return $scope.form[$scope.sigClientNumberFieldName].$viewValue;
        },
        function (newValue, oldValue, scope)
        {
            var field = $scope.form[$scope.sigClientNumberFieldName];
            newValue = field.$isEmpty(newValue) ? "" : newValue;
            oldValue = field.$isEmpty(oldValue) ? "" : oldValue;
            forceNumber(field, newValue, oldValue);
        }
    );
///////////////////////////////////////////////////////////////////////////////////////////

/////////////// watch mobile number and force it to have space and to be compounded by number ////
    $scope.$watch(
        function() {
            if ($scope.form[$scope.mobileFieldName]) {
                return $scope.form[$scope.mobileFieldName].$viewValue;
            }
            return $scope.fake;
        },
        function (newValue, oldValue, scope)
        {
            if (newValue == oldValue) {
                return;
            }

            if (!$scope.form[$scope.mobileFieldName]) {
                return;
            }

            var field = $scope.form[$scope.mobileFieldName];
            newValue = field.$isEmpty(newValue) ? "" : newValue;
            oldValue = field.$isEmpty(oldValue) ? "" : oldValue;

            $scope.mobilePhone = newValue.split(" ").join('');

            if (newValue.length >= oldValue.length) {
                addSpace(field, newValue);
                forceMobileNumber(field, newValue);
            }
        }
    );
//////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////Picto rules ////////////////////////////////
    $scope.showValidPicto = function(fieldName)
    {
        var field = $scope.form[fieldName];

        return !field.$isEmpty(field.$viewValue) && field.$valid;
    }

    $scope.showInvalidPicto = function(fieldName)
    {
        var field = $scope.form[fieldName];

        return !field.$isEmpty(field.$viewValue) && field.$invalid;
    }

    $scope.showValidDatePicto = function()
    {

        var fieldDay   = $scope.form[$scope.birthDayFieldName];
        var fieldMonth = $scope.form[$scope.birthMonthFieldName];
        var fieldYear  = $scope.form[$scope.birthYearFieldName];

        return !fieldDay.$isEmpty(fieldDay.$viewValue)
            && !fieldMonth.$isEmpty(fieldMonth.$viewValue)
            && !fieldYear.$isEmpty(fieldYear.$viewValue)

            && fieldDay.$valid
            && fieldMonth.$valid
            && fieldYear.$valid

            && isDateValid();
    }

    $scope.showInvalidDatePicto = function(fieldName)
    {
        var fieldDay   = $scope.form[$scope.birthDayFieldName];
        var fieldMonth = $scope.form[$scope.birthMonthFieldName];
        var fieldYear  = $scope.form[$scope.birthYearFieldName];

        return !fieldDay.$isEmpty(fieldDay.$viewValue)
            && !fieldMonth.$isEmpty(fieldMonth.$viewValue)
            && !fieldYear.$isEmpty(fieldYear.$viewValue)

            && (! fieldDay.$valid
                || !fieldMonth.$valid
                || !fieldYear.$valid

                || !isDateValid()
            );
    }

    /**
     *  form can be submit with a such current date
     *
     */
    $scope.isDatePermitted = function()
    {
        var fieldDay   = $scope.form[$scope.birthDayFieldName];
        var fieldMonth = $scope.form[$scope.birthMonthFieldName];
        var fieldYear  = $scope.form[$scope.birthYearFieldName];

        return (fieldDay.$isEmpty(fieldDay.$viewValue)
            && fieldMonth.$isEmpty(fieldMonth.$viewValue)
            && fieldYear.$isEmpty(fieldYear.$viewValue)
        ) || isDateValid();

    }
///////////////////////////////////////////////////////////////////

    $scope.ignoreFormat = function()
    {
        $scope.mobile = $scope.mobilePhone;
    }

////////////// CAPTCHA SECTION /////////////////////////////////////////

    var renderCaptcha = function() {
        $scope.rendered = window.grecaptcha.render('g-recaptcha', {
            'sitekey': $scope.secretCaptcha,
            'callback': setCaptchaResponse,
            'expired-callback': resetCaptchaResponse
        });
    };

    var timer = setInterval(function() {
        if (!window.grecaptcha || !window.grecaptcha.render || typeof window.grecaptcha.render != 'function') {
            return;
        }

        window.clearInterval(timer);
        renderCaptcha();
    }, 60);

    $scope.captchaResponse = null
    /**
     * validate captcha form part
     */
    var setCaptchaResponse = function(captchaResponse) {
        $scope.captchaResponse = captchaResponse;
        try {
            $scope.$apply()
        } catch (e) {
            $log.log('captcha response apply');
        }
        //$scope.$form['g-recaptcha-response'].
    }

    /**
     * validate captcha form part
     */
    var resetCaptchaResponse = function(captchaResponse) {
        $scope.captchaResponse = null;
        try {
            $scope.$apply()
        } catch (e) {
            $log.log('captcha response reset apply');
        }
    }

////////////// private ///////////////////////////////////////////////

    /**
     * force a field to be filled uniquely by numbers
     * @param field formField
     * @param newValue current viewValue of the field
     * @param oldValue old viewValue of the field
     */
    var forceNumber = function(field, newValue, oldValue)
    {
        var regex = /^[0-9]{0,10}$/;

        if (!regex.test(newValue)) {
            field.$setViewValue(oldValue);
            field.$render();
        }
    }

    /**
     * fill input field like phone number
     * @param field formField
     * @param newValue current viewValue of the field
     */
    var addSpace = function(field, newValue)
    {
        if ((newValue.length + 1) % 3 == 0){
            field.$setViewValue(newValue + " ");
            field.$render();
        }
    }

    /**
     * force input field have uniquely phone number string
     * @param field formField
     * @param newValue current viewValue of the field
     */
    var forceMobileNumber = function(field, newValue)
    {
        var regex = /^([0-9]{1,2}[ ]?)*$/;

        if (!regex.test(newValue)) {
            newValue = newValue.substr(0, newValue.length - 1);
            field.$setViewValue(newValue);
            field.$render();
        }
    }
    /**
     * check date validity
     *
     * @return boolean true if date is valid
     */
    var isDateValid = function()
    {
        try {
            var testDate = new Date();
            testDate.setFullYear($scope.birthYear, $scope.birthMonth - 1, $scope.birthDay);
            var year = testDate.getFullYear();
            var month = testDate.getMonth();
            var day = testDate.getDate();

            if (!year == $scope.birthYear
                || !((month + 1) == $scope.birthMonth)
                || !(day == $scope.birthDay)
            ) {
                return false;
            }
        } catch(e){
            return false;
        }

        return true;
    }
}
]);