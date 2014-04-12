/* Input purposes */
var UNDEFINED_PURPOSE = 'undefined_purpose';
var PHONE_PURPOSE = 'phone_purpose';
var AGE_PURPOSE = 'age_purpose';
var YEAR_PURPOSE = 'year_purpose';
var NAME_PURPOSE = 'name_purpose';
var POSTCODE_PURPOSE = 'postcode_purpose';

/* Limit types */
var MINLENGTH_LIMIT = 'minlength_limit';
var MAXLENGTH_LIMIT = 'maxlength_limit';
var MIN_LIMIT = 'min_limit';
var MAX_LIMIT = 'max_limit';

function isEmpty($input) {
    return !$.trim($input.val());
}

function isVisible($input) {
    return $input.is(":visible");
}

function isEnabled($input) {
    return $input.is(":enabled");
}

function isAnyInputChecked($inputs) {
    var anyInputChecked = false;

    $inputs.each(function() {
	if ($(this).is(':checked')) {
	    anyInputChecked = true;
	    return false; // breaks the loop
	}
    });

    return anyInputChecked;
}

/*
 * Returns an array of limits, i.e.:
 * - min/max length
 * - min/max value
 */
function defineLimits($input) {
    var limits = {};
    var minlength = $input.attr('minlength');
    var maxlength = $input.attr('maxlength');
    var min = $input.attr('min');
    var max = $input.attr('max');

    if (minlength) {
	limits[MINLENGTH_LIMIT] = minlength;
    }
    if (maxlength) {
	limits[MAXLENGTH_LIMIT] = maxlength;
    }
    if (min) {
	limits[MIN_LIMIT] = min;
    }
    if (max) {
	limits[MAX_LIMIT] = max;
    }

    logInfo($input, 'limits', limits);

    return limits;
}

/*
* Return min and max limits if given.
* Otherwise creates values for provided purpose.
*/
function getOrCreateMinAndMaxLimits(purpose, limits) {
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

/*
 * Considers:
 * - min and max properties
 * - name and label to guess input's role, e.g. age, year
 */
function defineInputPurpose($input) {
    var purposeByLabel = defineInputPurposeByLabel($input);

    if (typeof purposeByLabel !== UNDEFINED_PURPOSE) {
	logInfo($input, 'purpose', purposeByLabel);
	return purposeByLabel;
    }

    return UNDEFINED_PURPOSE;
}

function containsText(searchFor, inString) {
    return inString.toLowerCase().indexOf(searchFor) >= 0;
}

/*
 * Considers label text:
 * - phone
 * - age
 * - year
 */
function defineInputPurposeByLabel($input) {
    var labelText = '';

    if ($input.prop('id')) {
	labelText = $('label[for="' + $input.prop('id') + '"]').text();
    }

    if (containsText('phone', labelText)) {
	return PHONE_PURPOSE;
    } else if (containsText('age', labelText)) {
	return AGE_PURPOSE;
    } else if (containsText('year', labelText)) {
	return YEAR_PURPOSE;
    }

    return UNDEFINED_PURPOSE;
}

function findInputsByTypeAndName($here, type, name) {
    return $here.find('input[type=' + type + '][name=' + name + ']');
}

function findVisibleEnabledInputsByTypeAndName($here, type, name) {
    return $here.find('input[type=' + type + '][name=' + name + ']:visible:enabled');
}

function isExcluded(groupName) {
    return $.inArray(groupName, excludedNames) !== -1;
}
