var DummyFormFiller = function() {

    var _augur;
    var _generator;

	this.populateDummyData = function() {
		var $here = $('html');
        _augur = new DummyAugur();
        _generator = new DummyGenerator();

        $here.find('form').each(function(){
            $(this)[0].reset();
        });

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
		} else if ($element.is('[type=email]') && isEmptyVisibleAndEnabled($element)) {
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
		} else if ($element.is('select') && isSelectVisibleEnabledAndUnselected($element)) {
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
	 * select single option if currently selected is rightfully selected. Does not
	 * select multiple options if any already selected.
	 */
	function clickRandomOptionOrOptions($select) {
		if ($select.prop('multiple')) {
            $select.find('option').each(function() {
                $(this).prop("selected", chance.bool());
            });
		} else {
		    var rightfulOptions = getRightfulOptions($select);

            if(rightfulOptions.length > 0){
			    $(chance.pick(rightfulOptions)).prop("selected", true);
			}
		}
	}

	/**
	 * Returns options that are considered rightfully selectable. Excludes 'starting options' (that should never be selected).
	 * Selectable options are:
	 * - enabled
	 * - not empty
	 */
	function getRightfulOptions($select) {
	    var rightfulOptions = [];

	    $select.find('option').each(function() {
	        if(isEnabled($(this)) && $.trim($(this).text())){
	            rightfulOptions.push($(this));
	        }
	    });

	    return rightfulOptions;
	}

	/**
	 * Populates given element with a random text or readdresses the task to more
	 * appropriate populator. Considers:
	 *   - min and max properties
	 *   - name and label to guess input's role, e.g. age, year
	 */
	function populateWithRandomTextWisely($element) {
		var purpose = _augur.defineInputPurpose($element);

		switch (purpose) {
		case DummyPurposeEnum.PHONE_PURPOSE:
		case DummyPurposeEnum.AGE_PURPOSE:
		case DummyPurposeEnum.YEAR_PURPOSE:
			populateWithRandomNumberWisely($element, purpose);
			break;
        case DummyPurposeEnum.EMAIL_PURPOSE:
            $element.val(_generator.getDummyEmail());
            break;
		case DummyPurposeEnum.UNDEFINED_PURPOSE:
		default:
		    var limits = DummyLimitsUtils.readAndAdjustMinlengthMaxLengthLimits($element);
			$element.val(_generator.getDummyText(limits));
		}
	}

	/**
	 * Populates given element with a random number. Considers:
     *   - min and max properties
     *   - name and label to guess input's role, e.g. age, year
	 */
	function populateWithRandomNumberWisely($element, purpose) {
		purpose = (typeof purpose !== 'undefined') ? purpose : _augur.defineInputPurpose($element);

		switch (purpose) {
		case DummyPurposeEnum.PHONE_PURPOSE:
			$element.val(_generator.getDummyPhone());
			break;
		case DummyPurposeEnum.AGE_PURPOSE:
			var ageLimits = DummyLimitsUtils.readAndAdjustMinMaxLimits(DummyPurposeEnum.AGE_PURPOSE, $element);
			$element.val(_generator.getDummyNumber(ageLimits));
			break;
		case DummyPurposeEnum.YEAR_PURPOSE:
			var yearLimits = DummyLimitsUtils.readAndAdjustMinMaxLimits(DummyPurposeEnum.YEAR_PURPOSE, $element);
			$element.val(_generator.getDummyNumber(yearLimits));
			break;
		case DummyPurposeEnum.UNDEFINED_PURPOSE:
		default:
		    var limits = DummyLimitsUtils.readAndAdjustMinMaxLimits(null, $element);
			$element.val(_generator.getDummyNumber(limits));
		}
	}

	/**
	 * Populates given element with a random date. Considers:
	 *   - min and max properties
	 */
	function populateWithRandomDateWisely($element) {
		var limits = DummyLimitsUtils.readAndAdjustDateLimits($element);

        $element.val(_generator.getDummyDate(limits));
	}

	function isEmptyVisibleAndEnabled($element) {
		return isEmpty($element) && isVisible($element) && isEnabled($element);
	}

	function isSelectVisibleEnabledAndUnselected($select) {
        return isVisible($select) && isEnabled($select) && !isAnyRightfulOptionSelected($select);
	}

	function isAnyRightfulOptionSelected($select) {
        var rightfulOptions = getRightfulOptions($select);

        for (var i = 0; i < rightfulOptions.length; ++i) {
            if ($(rightfulOptions[i]).prop('selected')) {
                return true;
            }
        }

        return false;
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

	function isAnyInputChecked($elements) {
		var anyInputChecked = false;

		$elements.each(function() {
			if ($(this).is(':checked')) {
				anyInputChecked = true;
				return false; // breaks the loop only; does not return anything from the method
			}
		});

		return anyInputChecked;
	}

	function findVisibleEnabledInputsByTypeAndName($here, type, name) {
		return $here.find('input[type=' + type + '][name="' + name + '"]:visible:enabled');
	}

	function isExcluded(groupName) {
		return $.inArray(groupName, excludedNames) !== -1;
	}

	return this;
}();
