var DummyFormFiller = function() {
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
			populateWithRandomNumberWisely($input, DummyPurposeEnum.YEAR_PURPOSE);
			break;
		case DummyPurposeEnum.UNDEFINED_PURPOSE:
		default:
			$input.val(getDummyText(getOrCreateMinlengthAndMaxlengthLimits($input)));
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

        var date = null;

        try {
            date = chance.date({
                min: new Date(limits.min.toString()),
                max: new Date(limits.max.toString())
            });
            date = date.toISOString().split('T')[0];
        }
        catch(err) {
           DummyLogger.log(err);
        }

        $input.val(date);
	}

	/*
	 * ################ ### HELPERS #### ################
	 */

	/**
	 * Checks if 'limits' contain min and max values. If yes, they are
	 * returned. Otherwise new values are created for provided purpose.
	 */
	function getOrCreateMinAndMaxLimits(purpose, $input) {
        var limits = new DummyLimits($input);

		if (limits.min != null && limits.max != null) {
			return limits;
		}

		var min = 1;
		var max = 100;

		if (DummyPurposeEnum.AGE_PURPOSE === purpose) {
			min = 21;
			max = 75;
		} else if (DummyPurposeEnum.YEAR_PURPOSE === purpose) {
			min = 1940;
			max = 2015;
		}

        limits.min = Number(min);
        limits.max = Number(max);

        DummyLogger.log($input, 'created limits', limits);

		return limits;
	}
	/**
     * Checks if 'limits' contain min and max values. If yes, they are
     * returned. Otherwise new values are created for provided purpose.
     */
    function getOrCreateMinlengthAndMaxlengthLimits($input) {
        var limits = new DummyLimits($input);
        console.log('#######################');

		if (limits.minlength != null && limits.maxlength != null) {
			return limits;
		}

        if(limits.minlength == null){
            limits.minlength = Number(chance.natural({
                min : 1,
                max : limits.maxlength
                }));
        }

        if(limits.maxlength == null){
            limits.maxlength = Number(chance.natural({
                min : limits.minlength,
                max : limits.minlength + 5
                }));
        }

        DummyLogger.log($input, 'adjusted limits', limits);

        return limits;
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

		var min = limits.min == null ? 0 : Number(limits.min);
		var max = limits.max == null ? 500 : Number(limits.max);

        try {
            return chance.natural({
                min : min,
                max : max
            });
        }
        catch(err) {
           DummyLogger.log(err);
        }
	}

	/**
	 * Returns random text of a given length. First letter uppercased.
	 */
	function getDummyText(limits) {
        if (typeof limits === 'undefined') {
            return;
        }

        try {
            var text = $.trim(chance.string({
                length : chance.natural({
                    min : limits.minlength,
                    max : limits.maxlength
                }),
                pool : DEI_KOBOL
            }));

            return chance.capitalize(text);
        }
        catch(err) {
           DummyLogger.log(err);
        }
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
}();
