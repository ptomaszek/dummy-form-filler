function populateDummyData() {
    var $here = $('form');
    $.each($here.find('input'), function() {
	populateInputIfNotSetYet($(this), $here);
    });
}

function populateInputIfNotSetYet($input, $topParent) {
    var dummyEmail = getDummyEmail();

    if ($input.is('[type=text]')) {
	if (isEmpty($input) && isVisible($input) && isEnabled($input)) {
	    $input.val(getDummyText());
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
	    populateRandomNumberWisely($input);
	}
    }
}

/*
 * Considers: 
 * - min and max properties 
 * - name and label to guess input's role, e.g. age, year
 */
function populateRandomNumberWisely($input) {
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
    $($inputs[randomIndex]).prop('checked', true);
}

function checkRandomInputs($inputs) {
    var randomBoolean;
    $.each($inputs, function() {
	randomBoolean = (Math.floor(Math.random() * 2) === 0);
	if (randomBoolean && isVisible($(this)) && isEnabled($(this))) {
	    $($(this)).prop('checked', true);
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
