var $HERE = $('form');

function populateDummyData() {
    $.each($HERE.find('input'), function () {
        populateInputIfNotSetYet($(this));
    });
}

function populateInputIfNotSetYet($input) {
	var dummyEmail = getDummyEmail();
	
    if ($input.is(':text')) {
        if (isEmpty($input) && isVisible($input) && isEnabled($input)) {
            $input.val(getDummyText());
        }
    } else if ($input.is('[type=email]')) {
        if (isEmpty($input) && isVisible($input) && isEnabled($input)) {
            $input.val(dummyEmail);
        }
    } else if ($input.is(':radio')) {
        var groupName = $input.prop('name');
        var $radioInputs = findRadioInputsByName(groupName);
        if (isVisible($input) && isEnabled($input) && !isRadioGroupSet($radioInputs)) {
            checkRandomRadioButton($radioInputs);
        }
    }
}
function isRadioGroupSet($radioInputs){
    var isGroupSet = false;

    $($radioInputs.each(function() {
        if($(this).is(':checked')){
            isGroupSet = true;
        }
    }));
    
    return isGroupSet;
}

function findRadioInputsByName(name){
    return $HERE.find("input:radio[name='" + name + "']");
}
function checkRandomRadioButton($radioInputs){
   var randomIndex = Math.floor(Math.random()*$radioInputs.size());
   $($radioInputs[randomIndex]).prop('checked', true);
}

/*Returns email inputs that are empty, visible and enabled. */
function findEmailInputs($here) {
    var $inputs = $here.find('');
    var $fitleredInputs = $inputs.filter(function () {
        if (isEmpty($(this)) && isVisible($(this)) && isEnabled($(this))) {
            return true;
        } else {
            return false;
        }
    });

    return $fitleredInputs;
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

    for (var i = 0; i < size; i++) {
        email += LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
    }

    email += '@'
    for (var i = 0; i < 5; i++) {
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