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
    }
}

function isAnyInputChecked($inputs){
    var isGroupSet = false;

    $inputs.each(function() {
        if($(this).is(':checked')){
            isGroupSet = true;
        }
    });
    
    return isGroupSet;
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
	$($(this)).prop('checked', randomBoolean);
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
    var size = 3 + Math.floor(Math.random() * 7);

    for ( var i = 0; i < size; i++) {
	email += LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
    }

    email += '@'
    for ( var i = 0; i < 5; i++) {
	email += LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
    }

    return email += '.com';
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
