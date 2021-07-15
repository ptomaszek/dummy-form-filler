var DummyPurposeEnum = {
    /** Input purposes */
    PHONE_PURPOSE: 'phone_purpose',
    AGE_PURPOSE: 'age_purpose',
    YEAR_PURPOSE: 'year_purpose',
    NAME_PURPOSE: 'name_purpose',
    POSTCODE_PURPOSE: 'postcode_purpose',
    EMAIL_PURPOSE: 'email_purpose',
    UNDEFINED_PURPOSE: 'undefined_purpose'
};

var DummyAugur = function() {

    /**
     * Considers: - min and max properties - name and label to guess input's
     * role, e.g. age, year
     */
    this.defineInputPurpose = function(input) {
        var purposeByLabel = this.defineInputPurpose(input);

        if (typeof purposeByLabel !== DummyPurposeEnum.UNDEFINED_PURPOSE) {
            DummyLogger.log(input, 'purpose', purposeByLabel);
            return purposeByLabel;
        }

        return DummyPurposeEnum.UNDEFINED_PURPOSE;
    };

    /**
     * Considers label text: - phone - age - year
     */
    this.defineInputPurpose = function(input) {
        var stringRelatedToTheInput = this.getStringRelatedToTheInput(input);
        DummyLogger.log(input, 'string related to the input', stringRelatedToTheInput);

        if (this.containsText(stringRelatedToTheInput, 'phone')) {
            return DummyPurposeEnum.PHONE_PURPOSE;
        } else if (this.containsText(stringRelatedToTheInput, 'age')) {
            return DummyPurposeEnum.AGE_PURPOSE;
        } else if (this.containsText(stringRelatedToTheInput, 'year')) {
            return DummyPurposeEnum.YEAR_PURPOSE;
        } else if (this.containsTexts(stringRelatedToTheInput, ['email', 'e-mail'])) {
            return DummyPurposeEnum.EMAIL_PURPOSE;
        }

        return DummyPurposeEnum.UNDEFINED_PURPOSE;
    };

    /**
     * Returns the first found string describing the input. Strings representation importance:
     *  - label
     *  - 'free' text before the input
     *  - id value
     *  - empty string ''
     * @param input
     * @returns {*}
     */
    this.getStringRelatedToTheInput = function(input) {
        if (input.id) {
            var label = document.querySelector('label[for="' + input.id + '"]');
            if (label) {
                var labelText = label.textContent;

                if(this.isNotEmpty(labelText)){
                    return labelText;
                }
            }
        }

        var previousSibling = input.previousSibling;

        if(previousSibling !== null) {
            var textBeforeInput = previousSibling.nodeValue;
            if (this.isNotEmpty(textBeforeInput)) {
                return textBeforeInput;
            }
        }

        if (input.id) {
            return input.getAttribute('id');
        }
        return '';
    };

    this.isNotEmpty = function(text) {
        return text.trim();
    };

    this.containsText = function(inString, text) {
        return inString.toLowerCase().indexOf(text.toLowerCase()) >= 0;
    };

    this.containsTexts = function(inString, texts) {
        for (var i = 0; i < texts.length; ++i) {
            if (this.containsText(inString, texts[i])) {
                return true;
            }
        }

        return false;
    };

    return this;
};
