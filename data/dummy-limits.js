function DummyLimits($element) {
    this.minlength = null;
    this.maxlength = null;
    this.min = null;
    this.max = null;

    this.toNumberOrNull = function(value) {
        return value == null ? null : new Number(value);
    }

    if(typeof $element !== 'undefined'){
        this.minlength = this.toNumberOrNull($element.attr('minlength'));
        this.maxlength = this.toNumberOrNull($element.attr('maxlength'));
        this.min = this.toNumberOrNull($element.attr('min'));
        this.max = this.toNumberOrNull($element.attr('max'));

        DummyLogger.log($element, 'read limits', this);
    }
};

function DummyDateLimits($element) {
    this.min = null;
    this.max = null;

    this.toDateOrNull = function(value) {
        return value == null ? null : new Date(value);
    }

    if(typeof $element !== 'undefined'){
        this.min = this.toDateOrNull($element.attr('min'));
        this.max = this.toDateOrNull($element.attr('max'));

        DummyLogger.log($element, 'read limits', this);
    }
};
