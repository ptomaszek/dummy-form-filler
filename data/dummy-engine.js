var DummyFormFiller = {};

DummyFormFiller = (function() {
	var engine = {};
    var _augur;

	engine.populateDummyData = function() {
		var $here = $('html');
        _augur = new DummyAugur();

		$.each($here.find('input, select, textarea'), function() {
			populateElementIfNotSetYet($(this), $here);
		});
	}

	var DEI_KOBOL = 'Dei Kobol una apita uthoukarana ' + 'Ukthea mavatha gaman kerimuta '
			+ 'Obe satharane mua osavathamanabanta ' + 'Api obata yagnya karama'
			+ 'ph\'nglui mglw\'nafh Cthulhu R\'lyeh wgah\'nagl fhtagn';

	var LETTERS = "abcdefghijklmnopqrstuvwxyz";

	var dummyEmail = chance.email();
	var excludedNames = [];

	/**
	 * Populates given element with a dummy value within parent's scope. Does
	 * not modify already populated element or element's family (that is defined
	 * by the 'name' attribute). Tries to figure out element's purpose, e.g.
	 * age, year. Ensures the value meets element's limitations, e.g. min,
	 * minlength.
	 */
	function populateElementIfNotSetYet($element, $topParent) {
		if ($element.is('[type=text]') && isEmptyVisibleAndEnabled($element)) {
				populateWithRandomTextWisely($element);
		}
		else if ($element.is('[type=email]') && isEmptyVisibleAndEnabled($element)) {
				$element.val(dummyEmail);
		} else if ($element.is('[type=url]') && isEmptyVisibleAndEnabled($element)) {
				$element.val('http://' + chance.domain());
		} else if ($element.is('[type=radio]')) {
			var groupName = $element.prop('name');
			if (isEnabled($element) && !isExcluded(groupName)) {
				var $radioInputs = findVisibleEnabledInputsByTypeAndName($topParent, 'radio', groupName);
				if (!isAnyInputChecked($radioInputs)) {
					clickRandomInput($radioInputs);
				}
				excludedNames.push(groupName);
			}
		} else if ($element.is('[type=checkbox]')) {
			var groupName = $element.prop('name');
			if (isVisible($element) && isEnabled($element) && !isExcluded(groupName)) {
				var $checkboxInputs = findVisibleEnabledInputsByTypeAndName($topParent, 'checkbox', groupName);
				if (!isAnyInputChecked($checkboxInputs)) {
					clickRandomInputs($checkboxInputs);
				}
				excludedNames.push(groupName);
			}
		} else if ($element.is('[type=password]') && isEmptyVisibleAndEnabled($element)) {
			$element.val("0Pa$$4uM^t3");
		} else if ($element.is('select') && isEmptyVisibleAndEnabled($element)) {
				clickRandomOptionOrOptions($element);
		} else if ($element.is('[type=number]') && isEmptyVisibleAndEnabled($element)) {
				populateWithRandomNumberWisely($element);
		} else if ($element.is('[type=date]') && isEmptyVisibleAndEnabled($element)) {
                populateWithRandomDateWisely($element);
        } else if ($element.is('[type=tel]') && isEmptyVisibleAndEnabled($element)) {
				$element.val(getDummyPhone());
		} else if ($element.is('textarea') && isEmptyVisibleAndEnabled($element)) {
				$element.val(chance.paragraph());
		}
	}

	/*
	 * ################ # MANIPULATORS # ################
	 */
	function clickRandomInput($elements) {
		$(chance.pick($elements)).click();
	}

	function clickRandomInputs($elements) {
		var randomBoolean;
		$.each($elements, function() {
			if (chance.bool() && isVisible($(this)) && isEnabled($(this))) {
				$($(this)).click();
			}
		});
	}
	/**
	 * Selects one option or, if 'multiple', random number of options. Does not
	 * select single option if currently selected index higher than 0. Does not
	 * select multiple options if any already selected.
	 */
	function clickRandomOptionOrOptions($select) {
		if ($select.prop('multiple')) {
            $select.find('option').each(function() {
                $(this).prop("selected", chance.bool());
            });
		} else {
			if ($select.prop("selectedIndex") <= 0) {
				$(chance.pick($select.find('option'))).prop("selected", true);
			}
		}
	}

	/**
	 * Populates given input with random text or readdresses the task to more
	 * appropriate populator. Considers: - min and max properties - name and
	 * label to guess input's role, e.g. age, year
	 */
	function populateWithRandomTextWisely($input) {
		var inputPurpose = _augur.defineInputPurpose($input);

		switch (inputPurpose) {
		case DummyPurposeEnum.PHONE_PURPOSE:
		case DummyPurposeEnum.AGE_PURPOSE:
		case DummyPurposeEnum.YEAR_PURPOSE:
			populateWithRandomNumberWisely($input, inputPurpose);
			break;
		case DummyPurposeEnum.UNDEFINED_PURPOSE:
		default:
			$input.val(getDummyText(getOrCreateMinlengthAndMaxlengthLimits(null, $input)));
		}
	}

	/**
	 * Populates given input with random number. Considers: - min and max
	 * properties - name and label to guess input's role, e.g. age, year
	 */
	function populateWithRandomNumberWisely($input, inputPurpose) {
		inputPurpose = (typeof inputPurpose !== 'undefined') ? inputPurpose : _augur.defineInputPurpose($input);

		switch (inputPurpose) {
		case DummyPurposeEnum.PHONE_PURPOSE:
			$input.val(getDummyPhone());
			break;
		case DummyPurposeEnum.AGE_PURPOSE:
			var ageLimits = getOrCreateMinAndMaxLimits(DummyPurposeEnum.AGE_PURPOSE, $input);
			$input.val(getDummyNumber(ageLimits));
			break;
		case DummyPurposeEnum.YEAR_PURPOSE:
			var yearLimits = getOrCreateMinAndMaxLimits(DummyPurposeEnum.YEAR_PURPOSE, $input);
			$input.val(getDummyNumber(yearLimits));
			break;
		case DummyPurposeEnum.UNDEFINED_PURPOSE:
		default:
			$input.val(getDummyNumber(getOrCreateMinAndMaxLimits(null, $input)));
		}
	}

	/**
	 * Populates given input with random date. Considers: - min and max properties
	 */
	function populateWithRandomDateWisely($input) {
		var limits = getOrCreateMinAndMaxLimits(DummyPurposeEnum.YEAR_PURPOSE, $input);

        var date = chance.date({
            min: new Date(limits[MIN_LIMIT].toString()),
            max: new Date(limits[MAX_LIMIT].toString())
        });

        $input.val(date.toISOString().split('T')[0]);
	}

	/*
	 * ################ ### HELPERS #### ################
	 */

	/** Limit types */
	var MINLENGTH_LIMIT = 'minlength_limit';
	var MAXLENGTH_LIMIT = 'maxlength_limit';
	var MIN_LIMIT = 'min_limit';
	var MAX_LIMIT = 'max_limit';

	/**
	 * Checks if 'limits' contain min and max values. If yes, they are
	 * returned. Otherwise new values are created for provided purpose.
	 */
	function getOrCreateMinAndMaxLimits(purpose, $input) {
        var limits = readLimits($input);
		if (MIN_LIMIT in limits && MAX_LIMIT in limits) {
			return limits;
		}

		var min = 1;
		var max = 100;
		var limitsToReturn = {};

		if (DummyPurposeEnum.AGE_PURPOSE === purpose) {
			min = 21;
			max = 75;
		} else if (DummyPurposeEnum.YEAR_PURPOSE === purpose) {
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
	/**
     * Checks if 'limits' contain min and max values. If yes, they are
     * returned. Otherwise new values are created for provided purpose.
     */
    function getOrCreateMinlengthAndMaxlengthLimits(purpose, $input) {
        var limits = readLimits($input);
        var limitsToReturn = {};

        if (MINLENGTH_LIMIT in limits && MAXLENGTH_LIMIT in limits) {
            if(limits[MINLENGTH_LIMIT] > limits[MAXLENGTH_LIMIT]){
                limitsToReturn[MINLENGTH_LIMIT] = -1;
                limitsToReturn[MAXLENGTH_LIMIT] = -1;

                DummyLogger.log($input, 'read/created limits', limitsToReturn);
                return limitsToReturn;
            }

            return limits;
        }

        var min = 5;
        var max = 10;

        if (!(MINLENGTH_LIMIT in limits) && !(MAXLENGTH_LIMIT in limits)) {
            limitsToReturn[MINLENGTH_LIMIT] = min;
            limitsToReturn[MAXLENGTH_LIMIT] = max;
            return limitsToReturn;
        }

        if (MINLENGTH_LIMIT in limits) {
            limitsToReturn[MINLENGTH_LIMIT] = limits[MINLENGTH_LIMIT];
        } else {
            limitsToReturn[MINLENGTH_LIMIT] = min < limits[MAXLENGTH_LIMIT] ? min : limits[MAXLENGTH_LIMIT];
        }

        if (MAXLENGTH_LIMIT in limits) {
            limitsToReturn[MAXLENGTH_LIMIT] = limits[MAXLENGTH_LIMIT];
        } else {
            limitsToReturn[MAXLENGTH_LIMIT] = max > limits[MINLENGTH_LIMIT] ? max : limits[MINLENGTH_LIMIT];
        }

        DummyLogger.log($input, 'read/created limits', limitsToReturn);

        return limitsToReturn;
    }

	function isEmptyVisibleAndEnabled($element) {
		return isEmpty($element) && isVisible($element) && isEnabled($element);
	}

	function isEmptyVisibleAndEnabled($element) {
		return isEmpty($element) && isVisible($element) && isEnabled($element);
	}

	function isEmpty($element) {
		return !$.trim($element.val());
	}

	function isVisible($element) {
		return $element.is(":visible");
	}

	function isEnabled($element) {
		return $element.is(":enabled");
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

	/**
	 * Returns an array of limits, i.e.: - min/max length - min/max value
	 */
	function readLimits($element) {
		var limits = {};
		var minlength = $element.attr('minlength');
		var maxlength = $element.attr('maxlength');
		var min = $element.attr('min');
		var max = $element.attr('max');

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

		DummyLogger.log($element, 'original limits', limits);

		return limits;
	}

	function findInputsByTypeAndName($here, type, name) {
		return $here.find('input[type=' + type + '][name="' + name + '"]');
	}

	function findVisibleEnabledInputsByTypeAndName($here, type, name) {
		return $here.find('input[type=' + type + '][name="' + name + '"]:visible:enabled');
	}

	function isExcluded(groupName) {
		return $.inArray(groupName, excludedNames) !== -1;
	}

	/*
	 * ################ ## GENERATORS ## ################
	 */

	/**
	 * Returns random number that meets given limitations, i.e. min and max
	 * values.
	 */
	function getDummyNumber(limits) {
		if (typeof limits === 'undefined') {
			return chance.natural({
				max : 500
			});
		}

		var min = Number(limits[MIN_LIMIT]);
		var max = Number(limits[MAX_LIMIT]);

		if (min > max) {
			return -1
		}
		return chance.natural({
			min : min,
			max : max
		});
	}

	/**
	 * Returns random text of a length of 5 to 10 characters. First letter
	 * uppercased.
	 */
	function getDummyText(limits) {
	    var text = '';
		if (typeof limits === 'undefined') {
            text = $.trim(chance.string({
                length : chance.natural({
                    min : 5,
                    max : 10
                }),
                pool : DEI_KOBOL
            }));
		} else {
		    text = $.trim(chance.string({
                length : chance.natural({
                    min :  parseFloat(limits[MINLENGTH_LIMIT]),
                    max :  parseFloat(limits[MAXLENGTH_LIMIT])
                }),
                pool : DEI_KOBOL
            }));
        }

		return chance.capitalize(text);
	}

	/**
	 * Returns random phone number.
	 */
	function getDummyPhone() {
		return chance.phone({
			formatted : false
		});
	}

	return engine;
}());
