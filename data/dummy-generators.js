/*
 * Returns random number that meets given limitations, i.e. min and max values.
 */
function getDummyNumber(limits) {
    var min = limits[MIN_LIMIT];
    var max = limits[MAX_LIMIT];

    if (min > max) {
	return -1
    }
    return chance.natural({
	min : min,
	max : max
    });
}

/*
 * Returns random text of a length of 5 to 10 characters. First letter uppercased.
 */
function getDummyText() {
    var text = $.trim(chance.string({
	length : chance.natural({
	    min : 5,
	    max : 10
	}),
	pool : DEI_KOBOL
    }));
    return chance.capitalize(text);
}

/*
 * Returns random phone number.
 * TODO: options: formatted phone number?
 */
function getDummyPhoneNumber() {
    return chance.phone({
	formatted : false
    });
}

/*
* Return min and max limits if given.
* Otherwise creates values for provided purpose.
*/
function getOrCreateMinAndMaxLimits(purpose, limits) {
    purpose = typeof purpose !== 'undefined' ? purpose : '';
    limits = typeof limits !== 'undefined' ? limits : {};

    if (MIN_LIMIT in limits && MAX_LIMIT in limits) {
	return limits;
    }

    var min = 1;
    var max = 100;
    var limitsToReturn = {};

    if (AGE_PURPOSE === purpose) {
	min = 21;
	max = 75;
    } else if (YEAR_PURPOSE === purpose) {
	min = 1940;
	max = 2015;
    }

    if (!(MIN_LIMIT in limits) && !(MAX_LIMIT in limits)) {
	limitsToReturn[MIN_LIMIT] = min;
	limitsToReturn[MAX_LIMIT] = max;
	return limitsToReturn;
    }

    if (MIN_LIMIT in limits) {
	limitsToReturn[MIN_LIMIT] = limits[MIN_LIMIT];
    } else {
	limitsToReturn[MIN_LIMIT] = min < limits[MAX_LIMIT] ? min : limits[MAX_LIMIT];
    }

    if (MAX_LIMIT in limits) {
	limitsToReturn[MAX_LIMIT] = limits[MAX_LIMIT];
    } else {
	limitsToReturn[MAX_LIMIT] = max > limits[MIN_LIMIT] ? max : limits[MIN_LIMIT];
    }

    return limitsToReturn;
}
