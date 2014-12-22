var DummyFormFiller = function() {
	var engine = {};

    var _augur;
    var _generator;

	engine.populateDummyData = function() {
		var $here = $('html');
        _augur = new DummyAugur();
        _generator = new DummyGenerator();

		$.each($here.find('input, select, textarea'), function() {
			populateElementIfNotSetYet($(this), $here);
		});
	}

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
				$element.val(_generator.getDummyEmail());
		} else if ($element.is('[type=url]') && isEmptyVisibleAndEnabled($element)) {
				$element.val('http://' + _generator.getDummyDomain());
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
				$element.val(_generator.getDummyPhone());
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
			$input.val(_generator.getDummyText(getOrCreateMinlengthAndMaxlengthLimits($input)));
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
			$input.val(_generator.getDummyPhone());
			break;
		case DummyPurposeEnum.AGE_PURPOSE:
			var ageLimits = getOrCreateMinAndMaxLimits(DummyPurposeEnum.AGE_PURPOSE, $input);
			$input.val(_generator.getDummyNumber(ageLimits));
			break;
		case DummyPurposeEnum.YEAR_PURPOSE:
			var yearLimits = getOrCreateMinAndMaxLimits(DummyPurposeEnum.YEAR_PURPOSE, $input);
			$input.val(_generator.getDummyNumber(yearLimits));
			break;
		case DummyPurposeEnum.UNDEFINED_PURPOSE:
		default:
			$input.val(_generator.getDummyNumber(getOrCreateMinAndMaxLimits(null, $input)));
		}
	}

	/**
	 * Populates given input with random date. Considers: - min and max properties
	 */
	function populateWithRandomDateWisely($input) {
		var limits = getOrCreateMinAndMaxDateLimits($input);

        $input.val(_generator.getDummyDate(limits));
	}

	/*
	 * ################ ### HELPERS #### ################
	 */

	function getOrCreateMinAndMaxDateLimits($input) {
        var limits = new DummyDateLimits($input);

		if (limits.isMinMaxGiven()) {
			return limits;
		} else if (limits.min == null && limits.max != null){
             limits.min = new Date(chance.date({
                 min : new Date(new Date(limits.max).setFullYear(limits.max.getFullYear() - 10)),
                 max : limits.max
             }));
         } else if (limits.max == null && limits.min != null){
             limits.max = new Date(chance.date({
                 min : limits.min,
                 max : new Date(new Date(limits.min).setFullYear(limits.min.getFullYear() + 10))
             }));
         } else {
            limits.min = new Date('1940');
            limits.max = new Date('2015');
         }

        DummyLogger.log($input, 'created limits', limits);

		return limits;
	}

	/**
	 * Checks if 'limits' contain min and max values. If yes, they are
	 * returned. Otherwise new values are created for provided purpose.
	 */
	function getOrCreateMinAndMaxLimits(purpose, $input) {
        var limits = new DummyLimits($input);

		if (limits.isMinMaxGiven()) {
			return limits;
		} else if (limits.min == null && limits.max != null){
             limits.min = Number(chance.natural({
                 min : 1,
                 max : limits.maxlength
                 }));
         } else if (limits.max == null && limits.min != null){
             limits.max = Number(chance.natural({
                 min : limits.minlength,
                 max : limits.minlength + 5
                 }));
         } else {
            if (DummyPurposeEnum.AGE_PURPOSE === purpose) {
                limits.min = Number(21);
                limits.max = Number(75);
            } else if (DummyPurposeEnum.YEAR_PURPOSE === purpose) {
                limits.min= Number(1940);
                limits.max = Number(2015);
            }
         }

        DummyLogger.log($input, 'created limits', limits);

		return limits;
	}
	/**
     * Checks if 'limits' contain min and max values. If yes, they are
     * returned. Otherwise new values are created for provided purpose.
     */
    function getOrCreateMinlengthAndMaxlengthLimits($input) {
        var limits = new DummyLimits($input);

		if (limits.isMinlengthMaxlengthGiven()) {
			return limits;
		} else if (limits.minlength == null && limits.maxlength != null){
            limits.minlength = Number(chance.natural({
                min : 1,
                max : limits.maxlength
                }));
        } else if (limits.maxlength == null && limits.minlength != null){
            limits.maxlength = Number(chance.natural({
                min : limits.minlength,
                max : limits.minlength + 5
                }));
        } else {
		    limits.minlength = 1;
		    limits.maxlength = 15;
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

	return engine;
}();
