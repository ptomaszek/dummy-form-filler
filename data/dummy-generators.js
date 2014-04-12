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
 * Returns random text of a length of 5 to 10 characters. First letter uppercased.
 */
function getDummyText() {
    var startIndex = Math.floor(Math.random() * DEI_KOBOL.length - 5);

    if (startIndex < 0) {
	startIndex = 0;
    }

    var endIndex = startIndex + 5 + Math.floor(Math.random() * 10);
    var text = $.trim(DEI_KOBOL.substring(startIndex, endIndex));

    return text.charAt(0).toUpperCase() + text.slice(1);
}

/*
 * Returns random phone number.
 */
function getDummyPhone() {
    return '123456789';
}

/*
 * Returns random email address.
 */
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

/*
 * Returns random text without spaces of a given length.
 */
function getDummyStringNoWhitespaces(length) {
    var dummyString = '';
    for ( var i = 0; i < length; i++) {
	dummyString += LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
    }

    return dummyString;
}
