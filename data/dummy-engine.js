function populateDummyData() {
    var $here = $('form');
    $.each($here.find('input'), function() {
	populateInputIfNotSetYet($(this), $here);
    });
}

var dummyEmail = getDummyEmail();

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
	    clickRandomInput($radioInputs);
	}
    } else if ($input.is('[type=checkbox]')) {
	var groupName = $input.prop('name');
	var $checkboxInputs = findInputsByTypeAndName($topParent, 'checkbox', groupName);
	if (isVisible($input) && isEnabled($input) && !isAnyInputChecked($checkboxInputs)) {
	    clickRandomInputs($checkboxInputs);
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
