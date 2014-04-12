function populateDummyData() {
    var $here = $('form');
    $.each($here.find('input'), function() {
	populateInputIfNotSetYet($(this), $here);
    });
}

var dummyEmail = getDummyEmail();

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
	var $radioInputs = findInputsByTypeAndName($topParent, 'radio', groupName);
	if (isVisible($input) && isEnabled($input) && !isAnyInputChecked($radioInputs)) {
	    checkRandomInput($radioInputs);
	}
    } else if ($input.is('[type=checkbox]')) {
	var groupName = $input.prop('name');
	var $checkboxInputs = findInputsByTypeAndName($topParent, 'checkbox', groupName);
	if (isVisible($input) && isEnabled($input) && !isAnyInputChecked($checkboxInputs)) {
	    checkRandomInputs($checkboxInputs);
	}
    } else if ($input.is('[type=number]')) {
	if (isEmpty($input) && isVisible($input) && isEnabled($input)) {
	    populateWithRandomNumberWisely($input);
	}
    } else if ($input.is('[type=tel]')) {
	if (isEmpty($input) && isVisible($input) && isEnabled($input)) {
	   // populateWithRandomPhoneNumber($input);
	}
    }
}

/*
 * Considers:
 * - min and max properties
 * - name and label to guess input's role, e.g. age, year
 */
function populateWithRandomTextWisely($input) {
    var inputPurpose = defineInputPurpose($input);
    var limits = defineLimits($input);

    switch (inputPurpose) {
    case PHONE_PURPOSE:
	// populateWithRandomPhoneNumber();
	break;
    case AGE_PURPOSE:
	var ageLimits = getOrCreateMinAndMaxLimits(AGE_PURPOSE, limits);
	$input.val(getDummyNumber(ageLimits));
	break;
    case YEAR_PURPOSE:
	var yearLimits = getOrCreateMinAndMaxLimits(YEAR_PURPOSE, limits);
	$input.val(getDummyNumber(yearLimits));
	break;
    default:
	$input.val(getDummyText());
    }
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
 * Returns random number that meets given limitations, i.e. min and max values.
 */
function getDummyNumber(limits) {
    var min = limits[MIN_LIMIT];
    var max = limits[MAX_LIMIT];

    if (min > max) {
	return -1
    }
    return +Math.floor(Math.random() * ((max - min) + 1)) + +min;
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

/*
* Prints information next to the given input.
* Doesn't log if there's nothing to show.
*/
function logInfo($input, key, value) {
    if ((value && typeof value !== 'object') || (typeof value === 'object' && Object.keys(value).length !== 0)) {
	console.log('Input id=\'' + $input.prop('id') + '\'\t- ' + key + ': ' + JSON.stringify(value, null, 4));
    }
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

/*
 * Considers:
 * - min and max properties
 * - name and label to guess input's role, e.g. age, year
 */
function populateWithRandomNumberWisely($input) {
    var min = $input.prop('min');
    var max = $input.prop('max');
    // if(year){}
    // if(age){}
    // var min = $.isNumeric(minInputProp) ? minInputProp : 0;
    // var max = $.isNumeric(maxInputProp) ? maxInputProp : (+min+100);

    var randomNumber = +Math.floor(Math.random() * ((max - min) + 1)) + +min;
    $input.val(randomNumber);
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

function findInputsByTypeAndName($here, type, name) {
    return $here.find('input[type=' + type + '][name=' + name + ']');
}

function checkRandomInput($inputs) {
    var randomIndex = Math.floor(Math.random() * $inputs.size());
    $($inputs[randomIndex]).click();
}

function checkRandomInputs($inputs) {
    var randomBoolean;
    $.each($inputs, function() {
	randomBoolean = (Math.floor(Math.random() * 2) === 0);
	if (randomBoolean && isVisible($(this)) && isEnabled($(this))) {
	    $($(this)).click();
	}
    });
}

function getDummyText() {
    var startIndex = Math.floor(Math.random() * DEI_KOBOL.length - 5);

    if (startIndex < 0) {
	startIndex = 0;
    }

    var endIndex = startIndex + 5 + Math.floor(Math.random() * 10);
    var text = $.trim(DEI_KOBOL.substring(startIndex, endIndex));

    return text.charAt(0).toUpperCase() + text.slice(1);
}

function getDummyPhone() {
    return '123456789';
}

function getDummyEmail() {
    var email = "";
    var random3To9 = 3 + Math.floor(Math.random() * 7);
    var random2To6 = 2 + Math.floor(Math.random() * 5);

    email = getDummyStringNoWhitespaces(random3To9);
    email += '@';
    email += getDummyStringNoWhitespaces(random2To6);
    email += '.com';

    return email;
}

function getDummyStringNoWhitespaces(length) {
    var dummyString = '';
    for ( var i = 0; i < length; i++) {
	dummyString += LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
    }

    return dummyString;
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
