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

/*TODO: to be removed
 * Populates given input with random number.
 * Considers:
 * - min and max properties
 * - name and label to guess input's role, e.g. age, year
 */
function populateWithRandomNumberWisely($input) {
    $input.val(getDummyNumber(getOrCreateMinAndMaxLimits()));
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
    case UNDEFINED_PURPOSE:
	$input.val(getDummyText());
	break;
    case PHONE_PURPOSE:
	$input.val(getDummyPhoneNumber());
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
