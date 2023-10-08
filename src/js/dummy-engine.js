var DummyFormFiller = function () {

    var _augur;
    var _generator;
    var excludedNames = [];

    this.populateDummyData = function () {
        var here = document.documentElement;
        _augur = new DummyAugur();
        _generator = new DummyGenerator();

        here.querySelectorAll('form').forEach(function (form) {
            form.reset();
        });

        here.querySelectorAll('input, select, textarea').forEach(function (input) {
            populateElementIfNotSetYet(input, here);
        });
        excludedNames = [];
    };


    /**
     * Populates given element with a dummy value within parent's scope. Does
     * not modify already populated element or element's family (that is defined
     * by the 'name' attribute). Tries to figure out element's purpose, e.g.
     * age, year. Ensures the value meets element's limitations, e.g. min,
     * minlength.
     */
    function populateElementIfNotSetYet(element, topParent) {
        if (isInputText(element) && isEmptyVisibleAndEnabled(element)) {
            populateWithRandomTextWisely(element);
        } else if (element.matches('[type=email]') && isEmptyVisibleAndEnabled(element)) {
            element.value = _generator.getDummyEmail();
        } else if (element.matches('[type=url]') && isEmptyVisibleAndEnabled(element)) {
            element.value = 'http://' + _generator.getDummyDomain();
        } else if (element.matches('[type=radio]')) {
            var groupName = element.name;
            if (isEnabled(element) && !isExcluded(groupName)) {
                var radioInputs = findVisibleEnabledInputsByTypeAndName(topParent, 'radio', groupName);
                if (!isAnyInputChecked(radioInputs)) {
                    clickRandomInput(radioInputs);
                }
                excludedNames.push(groupName);
            }
        } else if (element.matches('[type=checkbox]')) {
            var groupName = element.name;
            if (isVisible(element) && isEnabled(element) && !isExcluded(groupName)) {
                var checkboxInputs = findVisibleEnabledInputsByTypeAndName(topParent, 'checkbox', groupName);
                if (!isAnyInputChecked(checkboxInputs)) {
                    clickRandomInputs(checkboxInputs);
                }
                excludedNames.push(groupName);
            }
        } else if (element.matches('[type=password]') && isEmptyVisibleAndEnabled(element)) {
            _generator.withDummyPassword(element);
        } else if (element.matches('select') && isSelectVisibleEnabledAndUnselected(element)) {
            clickRandomOptionOrOptions(element);
        } else if (element.matches('[type=number]') && isEmptyVisibleAndEnabled(element)) {
            populateWithRandomNumberWisely(element);
        } else if (element.matches('[type=date]') && isEmptyVisibleAndEnabled(element)) {
            populateWithRandomDateWisely(element);
        } else if (element.matches('[type=tel]') && isEmptyVisibleAndEnabled(element)) {
            element.value = _generator.getDummyPhone();
        } else if (element.matches('textarea') && isEmptyVisibleAndEnabled(element)) {
            let limits = DummyLimitsUtils.readAndAdjustMinLengthMaxLengthLimits(element);
            element.value = _generator.getDummyParagraph(limits);
        } else {
            return;
        }


        // publish low level DOM change event; it can be picked up by some frameworks like AngularJS
        var event = new UIEvent("change", {
            "view": window,
            "bubbles": true,
            "cancelable": true
        });
        element.dispatchEvent(event);
    }

    function clickRandomInput(elements) {
        chance.pick(elements).click();
    }

    function clickRandomInputs(elements) {
        elements.forEach(function (element) {
            if (chance.bool() && isVisible(element) && isEnabled(element)) {
                element.click();
            }
        });
    }

    /**
     * Selects one option or, if 'multiple', random number of options. Does not
     * select single option if currently selected is rightfully selected. Does not
     * select multiple options if any already selected.
     */
    function clickRandomOptionOrOptions(select) {
        if (select.multiple) {
            select.querySelectorAll('option').forEach(function (option) {
                option.selected = chance.bool();
            });
        } else {
            var rightfulOptions = getRightfulOptions(select);

            if (rightfulOptions.length > 0) {
                chance.pick(rightfulOptions).selected = true;
            }
        }
    }

    /**
     * Returns options that are considered rightfully selectable. Excludes 'starting options' (that should never be selected).
     * Selectable options are:
     * - enabled
     * - not empty
     */
    function getRightfulOptions(select) {
        var rightfulOptions = [];
        var notRightfulTextsForSelect = ['select', 'choose', 'pick', ' wybierz'];

        select.querySelectorAll('option').forEach(function (option) {
            var selectText = option.textContent;
            if (!isEmpty(option) && isEnabled(option) && selectText.trim() && !_augur.containsTexts(selectText, notRightfulTextsForSelect)) {
                rightfulOptions.push(option);
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
    function populateWithRandomTextWisely(element) {
        if (element.pattern) {
            element.value = _generator.getDummyTextMatchingPattern(element.pattern);
            return;
        }

        var purpose = _augur.defineInputPurpose(element);

        switch (purpose) {
            case DummyPurposeEnum.PHONE_PURPOSE:
            case DummyPurposeEnum.AGE_PURPOSE:
            case DummyPurposeEnum.YEAR_PURPOSE:
                populateWithRandomNumberWisely(element, purpose);
                break;
            case DummyPurposeEnum.EMAIL_PURPOSE:
                element.value = _generator.getDummyEmail();
                break;
            case DummyPurposeEnum.UNDEFINED_PURPOSE:
            default:
                var limits = DummyLimitsUtils.readAndAdjustMinLengthMaxLengthLimits(element);
                element.value = _generator.getDummyText(limits);
        }
    }

    /**
     * Populates given element with a random number. Considers:
     *   - min and max properties
     *   - name and label to guess input's role, e.g. age, year
     */
    function populateWithRandomNumberWisely(element, purpose) {
        purpose = (typeof purpose !== 'undefined') ? purpose : _augur.defineInputPurpose(element);

        switch (purpose) {
            case DummyPurposeEnum.PHONE_PURPOSE:
                element.value = _generator.getDummyPhone();
                break;
            case DummyPurposeEnum.AGE_PURPOSE:
                var ageLimits = DummyLimitsUtils.readAndAdjustMinMaxLimits(DummyPurposeEnum.AGE_PURPOSE, element);
                element.value = _generator.getDummyNumber(ageLimits);
                break;
            case DummyPurposeEnum.YEAR_PURPOSE:
                var yearLimits = DummyLimitsUtils.readAndAdjustMinMaxLimits(DummyPurposeEnum.YEAR_PURPOSE, element);
                element.value = _generator.getDummyNumber(yearLimits);
                break;
            case DummyPurposeEnum.UNDEFINED_PURPOSE:
            default:
                var limits = DummyLimitsUtils.readAndAdjustMinMaxLimits(null, element);
                element.value = _generator.getDummyNumber(limits);
        }
    }

    /**
     * Populates given element with a random date. Considers:
     *   - min and max properties
     */
    function populateWithRandomDateWisely(element) {
        var limits = DummyLimitsUtils.readAndAdjustDateLimits(element);

        element.value = _generator.getDummyDate(limits);
    }

    function isInputText(element) {
        return element.matches('[type=text]')
            || (element.matches('input') && !element.matches('[type]')); //or no input type is set, so it's the 'text' by default
    }

    function isEmptyVisibleAndEnabled(element) {
        return isEmpty(element) && isVisible(element) && isEnabled(element);
    }

    function isSelectVisibleEnabledAndUnselected(select) {
        return isVisible(select) && isEnabled(select) && !isAnyRightfulOptionSelected(select);
    }

    function isAnyRightfulOptionSelected(select) {
        var rightfulOptions = getRightfulOptions(select);

        for (var i = 0; i < rightfulOptions.length; ++i) {
            if (rightfulOptions[i].selected) {
                return true;
            }
        }

        return false;
    }

    function isEmpty(element) {
        return !element.value.trim();
    }

    /**
     * Taken from jQuery.
     * https://github.com/jquery/jquery/blob/main/src/css/hiddenVisibleSelectors.js
     */
    function isVisible(element) {
        return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
    }

    function isEnabled(element) {
        return element.matches(":enabled");
    }

    function isAnyInputChecked(elements) {
        var anyInputChecked = false;
        elements.forEach(function (element) {
            if (element.matches(':checked')) {
                anyInputChecked = true;
                return false; // breaks the loop only; does not return anything from the method
            }
        });

        return anyInputChecked;
    }

    function findVisibleEnabledInputsByTypeAndName(here, type, name) {
        return Array.from(here.querySelectorAll('input[type=' + type + '][name="' + name + '"]:enabled')).filter(isVisible);
    }

    function isExcluded(groupName) {
        return excludedNames.includes(groupName);
    }

    return this;
}();
