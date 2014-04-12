function populateDummyData() {
    var $here = $('form');
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
	    $input.val(getDummyPhoneNumber());
	}
    }
}
