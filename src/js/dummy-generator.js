var DummyGenerator = function (_options) {
    var DUMMY_EMAIL = chance.email();

    /**
     * Returns random number that meets given limitations, i.e. min and max
     * values.
     */
    this.getDummyNumber = function (limits) {
        try {
            return chance.natural({
                min: limits.min,
                max: limits.max
            });
        }
        catch (err) {
            DummyLogger.log(err);
        }
    };

    /**
     * Returns random text of a given length. First letter uppercased.
     */
    this.getDummyText = function (limits) {
        if (typeof limits === 'undefined') {
            return;
        }

        return Promise.all([
            _options.getOption('textCharactersPool'),
            _options.getOption('textStrategy')
        ])
        .then(([
            textCharactersPool,
            textStrategy
        ]) => {
            let text = chance.string({
                length: chance.natural({
                    min: limits.minlength,
                    max: limits.maxlength
                }),
                pool: textCharactersPool
            }).trim();

            if(textStrategy == 'plain') {
                return text;
            } else if (textStrategy == 'capitalizeFirstAndLowercaseRemaining') {
                return chance.capitalize(text.toLowerCase());
            } else { // just fallback to plain
                return text;
            }
        });
    };

    /**
     * Returns random phone number.
     */
    this.getDummyPhone = function (limits) {
        return chance.phone({
            formatted: false
        });
    };

    this.getDummyEmail = function () {
        return DUMMY_EMAIL;
    };

    this.getDummyDomain = function () {
        return chance.domain();
    };

    this.getDummyPassword = function (element) {
        return _options.getOption('password');
    };

    this.getDummyDate = function (limits) {
        try {
            return chance.date({
                min: limits.min,
                max: limits.max
            }).toISOString().split('T')[0];
        }
        catch (err) {
            DummyLogger.log(err);
        }
    };

    this.getDummyParagraph = function (limits) {
        let length = chance.natural({
            min: limits.minlength,
            max: limits.maxlength
        });

        let paragraph = '';

        while (paragraph.length < length) {
            paragraph += chance.sentence() + ' ';
        }
        return paragraph.substring(0, length);
    };

    return this;
};
