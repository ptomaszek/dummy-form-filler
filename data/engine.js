function populateDummyData() {
    var $where = $('form');
    var $textInputs = findTextInputs($where);
    var $emailInputs = findEmailInputs($where);
    var $radioInputs = findRadioInputs($where);

    console.log("Text inputs: %s", $textInputs.size());
    console.log("Email inputs: %s", $emailInputs.size());
    console.log("Radio inputs: %s", $radioInputs.size());

    populateTextInputs($textInputs);
    populateEmailInputs($emailInputs);
    // populateRadioInputs($radioInputs);
}

/*Returns text inputs that are empty, visible and enabled. */
function findTextInputs($here) {
    var $inputs = $here.find('input:text');
    var $fitleredInputs = $inputs.filter(function () {
        if (isEmpty($(this)) && isVisible($(this)) && isEnabled($(this))) {
            return true;
        } else {
            return false;
        }
    });

    return $fitleredInputs;
}

/*Returns email inputs that are empty, visible and enabled. */
function findEmailInputs($here) {
    var $inputs = $here.find('input[type=email]');
    var $fitleredInputs = $inputs.filter(function () {
        if (isEmpty($(this)) && isVisible($(this)) && isEnabled($(this))) {
            return true;
        } else {
            return false;
        }
    });

    return $fitleredInputs;
}

/*Returns array of grouped (by name) radio inputs that are not set, are visible and enabled. */
function findRadioInputs($here) {
    var $inputs = $here.find('input:radio');
    var $excludedInputNames = getUncheckedRadioInputGroups($inputs);

    // alert($excludedInputNames.prop("name"));

    var $fitleredInputs = $inputs.filter(function () {
        if (isVisible($(this)) && isEnabled($(this))) {
            return true;
        } else {
            return false;
        }
    });

    return $fitleredInputs;
}

function getUncheckedRadioInputGroups($inputs) {
    var alreadyCheckedRadioInputs = $inputs.filter(':checked').map(function (n, i) {
        return $(i).prop('name');
    });

    var inputGroups = {};
    $.each($inputs, function (key, value) {
        var groupName = $(value).prop('name');
        if ($.inArray(groupName, $(alreadyCheckedRadioInputs)) <0 ) { //if no radio in group set yet
            if (!(groupName in inputGroups)) { //and no group for that radio exist 
                inputGroups[groupName] = []; //then create an sub-array for a new radio group
            }
            inputGroups[groupName].push($(value));//add radio input to the group
        }
    });

    return $inputGroups;
}

function populateTextInputs($inputs) {
    $inputs.each(function () {
        $(this).val(getDummyText());
    });
}

function populateEmailInputs($inputs) {
    var dummyEmail = getDummyEmail();
    $inputs.each(function () {
        $(this).val(dummyEmail);
    });
}

/* function populateRadioInputs($inputs) {
    //alert($inputs.size());
    $inputs.each(function () {
        alert();
        $(this).checked(true);
    });
} */

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
