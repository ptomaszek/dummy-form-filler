function populateDummyData() {
    var $here = $('html');

    $.each($here.find('input'), function() {
	populateInputIfNotSetYet($(this), $here);
    });
}

var dummyEmail = chance.email();
var excludedNames = [];

/*
 * Populates given input  with a dummy value within parent's scope.
 * Does not modify already populated input or input's family (that is defined by the 'name' attribute).
 * Tries to figure out input's purpose, e.g. age, year.
 * Ensures the value meets input's limitations, e.g. min, minlength.
 */
function populateInputIfNotSetYet($input, $topParent) {
    if ($input.is('[type=text]')) {
	if (isEmpty($input) && isVisible($input) && isEnabled($input)) {
	    populateWithRandomTextWisely($input);
	}
    } else if ($input.is('[type=email]')) {
	if (isEmpty($input) && isVisible($input) && isEnabled($input)) {
	    $input.val(dummyEmail);
	}
    } else if ($input.is('[type=radio]')) {
	var groupName = $input.prop('name');
	if (isVisible($input) && isEnabled($input) && !isExcluded(groupName)) {
	    var $radioInputs = findVisibleEnabledInputsByTypeAndName($topParent, 'radio', groupName);
	    if (!isAnyInputChecked($radioInputs)) {
		clickRandomInput($radioInputs);
	    }
	    excludedNames.push(groupName);
	}
    } else if ($input.is('[type=checkbox]')) {
	var groupName = $input.prop('name');
	if (isVisible($input) && isEnabled($input) && !isExcluded(groupName)) {
	    var $checkboxInputs = findVisibleEnabledInputsByTypeAndName($topParent, 'checkbox', groupName);
	    if (!isAnyInputChecked($checkboxInputs)) {
		clickRandomInputs($checkboxInputs);
	    }
	    excludedNames.push(groupName);
	}
    } else if ($input.is('[type=number]')) {
	if (isEmpty($input) && isVisible($input) && isEnabled($input)) {
	    populateWithRandomNumberWisely($input);
	}
    } else if ($input.is('[type=tel]')) {
	if (isEmpty($input) && isVisible($input) && isEnabled($input)) {
	    $input.val(getDummyPhone());
	}
    }
}

/*
 * ################
 * # MANIPULATORS #
 * ################
 */
function clickRandomInput($inputs) {
    $(chance.pick($inputs)).click();
}

function clickRandomInputs($inputs) {
    var randomBoolean;
    $.each($inputs, function() {
	if (chance.bool() && isVisible($(this)) && isEnabled($(this))) {
	    $($(this)).click();
	}
    });
}

/*
 * Populates given input with random text or readdresses the task to more appropriate populator.
 * Considers:
 * - min and max properties
 * - name and label to guess input's role, e.g. age, year
 */
function populateWithRandomTextWisely($input) {
    var inputPurpose = defineInputPurpose($input);
    var limits = defineLimits($input);

    switch (inputPurpose) {
    case PHONE_PURPOSE:
    case AGE_PURPOSE:
    case YEAR_PURPOSE:
	populateWithRandomNumberWisely($input, inputPurpose);
	break;
    case UNDEFINED_PURPOSE:
    default:
	$input.val(getDummyText());
    }
}

/*
 * Populates given input with random number.
 * Considers:
 * - min and max properties
 * - name and label to guess input's role, e.g. age, year
 */
function populateWithRandomNumberWisely($input, inputPurpose) {
    inputPurpose = (typeof inputPurpose !== 'undefined') ? inputPurpose : defineInputPurpose($input);
    var limits = defineLimits($input);

    switch (inputPurpose) {
    case PHONE_PURPOSE:
	$input.val(getDummyPhone());
	break;
    case AGE_PURPOSE:
	var ageLimits = getOrCreateMinAndMaxLimits(AGE_PURPOSE, limits);
	$input.val(getDummyNumber(ageLimits));
	break;
    case YEAR_PURPOSE:
	var yearLimits = getOrCreateMinAndMaxLimits(YEAR_PURPOSE, limits);
	$input.val(getDummyNumber(yearLimits));
	break;
    case UNDEFINED_PURPOSE:
    default:
	$input.val(getDummyNumber());
    }
}

/*
 * ################ 
 * ### HELPERS ####
 * ################
 */

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

/*
 * Checks if 'limits' contains min and max values. If yes, they are returned.
 * Otherwise new values are created for provided purpose.
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

/*
 * ################
 * ## GENERATORS ##
 * ################
 */

/*
 * Returns random number that meets given limitations, i.e. min and max values.
 */
function getDummyNumber(limits) {
    if (typeof limits === 'undefined') {
	return chance.natural({
	    max : 500
	});
    }

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
 */
function getDummyPhone() {
    return chance.phone({
	formatted : false
    });
}
