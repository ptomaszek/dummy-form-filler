var DummyPurposeEnum = {
    /** Input purposes */
    UNDEFINED_PURPOSE: 'undefined_purpose',
    PHONE_PURPOSE: 'phone_purpose',
    AGE_PURPOSE: 'age_purpose',
    YEAR_PURPOSE: 'year_purpose',
    NAME_PURPOSE: 'name_purpose',
    POSTCODE_PURPOSE: 'postcode_purpose'
};

var DummyAugur = function() {

    /**
     * Considers: - min and max properties - name and label to guess input's
     * role, e.g. age, year
     */
    this.defineInputPurpose = function($input) {
        var purposeByLabel = this.defineInputPurposeByLabel($input);

        if (typeof purposeByLabel !== DummyPurposeEnum.UNDEFINED_PURPOSE) {
            DummyLogger.log($input, 'purpose', purposeByLabel);
            return purposeByLabel;
        }

        return DummyPurposeEnum.UNDEFINED_PURPOSE;
    }

    /**
     * Considers label text: - phone - age - year
     */
    this.defineInputPurposeByLabel = function($input) {
        var labelText = '';

        if ($input.prop('id')) {
            labelText = $('label[for="' + $input.prop('id') + '"]').text();
        }

        if (this.containsText('phone', labelText)) {
            return DummyPurposeEnum.PHONE_PURPOSE;
        } else if (this.containsText('age', labelText)) {
            return DummyPurposeEnum.AGE_PURPOSE;
        } else if (this.containsText('year', labelText)) {
            return DummyPurposeEnum.YEAR_PURPOSE;
        }

        return DummyPurposeEnum.UNDEFINED_PURPOSE;
    }

    this.containsText = function(searchFor, inString) {
        return inString.toLowerCase().indexOf(searchFor) >= 0;
    }

    return this;
};
