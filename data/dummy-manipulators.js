function clickRandomInput($inputs) {
    var randomIndex = Math.floor(Math.random() * $inputs.size());
    $($inputs[randomIndex]).click();
}

function clickRandomInputs($inputs) {
    var randomBoolean;
    $.each($inputs, function() {
	randomBoolean = (Math.floor(Math.random() * 2) === 0);
	if (randomBoolean && isVisible($(this)) && isEnabled($(this))) {
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
    var min = $input.prop('min');
    var max = $input.prop('max');
    // if(year){}
    // if(age){}
    // var min = $.isNumeric(minInputProp) ? minInputProp : 0;
    // var max = $.isNumeric(maxInputProp) ? maxInputProp : (+min+100);

    var randomNumber = +Math.floor(Math.random() * ((max - min) + 1)) + +min;
    $input.val(randomNumber);
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
