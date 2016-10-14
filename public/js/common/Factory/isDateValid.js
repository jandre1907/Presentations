angular.module("Common").factory('isDateValid',
["$q", "$log", "$http",
function($q, $log, $http) {
    dateService = {};
    dateService.business = {};
    /**
     * check date validity
     *
     * @return boolean true if date is valid
     */
    dateService.format = function(year, month, day)
    {
        try {
            var testDate = new Date();
            testDate.setFullYear(year, month - 1, day);

            var yearResult = testDate.getFullYear();
            var monthResult = testDate.getMonth();
            var dayResult = testDate.getDate();

            if (!yearResult == year
                || !((monthResult + 1) == month)
                || !(dayResult == day)
            ) {
                return false;
            }
        } catch(e){
            return false;
        }

        return true;
    }

    /**
     * return true if date is in the past
     */
    dateService.business.cmc = function(year, month, day)
    {
        if (!dateService.format(year, month, day)) {
            return false;
        }

        try {
            var currentDate = new Date();
            var testDate = new Date();
            testDate.setFullYear(year, month - 1, day);
        } catch(e) {
            return false;
        }

        return testDate < currentDate;
    }

    /**
     * PRIVATE
     * respond to the given date is more than yearOld in the past
     * @param yearOld int age to compare with given birthDate
     * @return boolean
     */
    function isMoreOldThan(yearOld, year, month, day)
    {
        var age = new Date();
        age.setFullYear(age.getFullYear() - yearOld);

        return year < age.getFullYear()
            || (year == age.getFullYear() && (month -1) < age.getMonth())
            || (year == age.getFullYear() && (month -1) == age.getMonth() && day < age.getDate());

    }

    /**
     * return true if date is betwenn 4 and 200 year in the past
     */
    dateService.business.sna = function(year, month, day)
    {
        if (!dateService.format(year, month, day)) {
            return false;
        }

        if (isMoreOldThan(200, year, month, day) || !isMoreOldThan(4, year, month, day)) {
            return false;
        }

        return true;
    }

    dateService.isOlder =  isMoreOldThan;

    return dateService;
}]);