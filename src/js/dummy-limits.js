import { DummyLogger } from './dummy-logger.js';
import { DummyPurposeEnum } from './dummy-augur.js';

//TODO PT: DRY; also simplify, e.g. rather than limit range return the random value from the range
function DummyLimits(element) {
    this.minlength = null;
    this.maxlength = null;
    this.min = null;
    this.max = null;

    this.toNumberOrNull = function(value) {
        return value == null ? null : new Number(value);
    }

    if(typeof element !== 'undefined'){
        this.minlength = this.toNumberOrNull(element.getAttribute('minlength'));
        this.maxlength = this.toNumberOrNull(element.getAttribute('maxlength'));
        this.min = this.toNumberOrNull(element.getAttribute('min'));
        this.max = this.toNumberOrNull(element.getAttribute('max'));

        DummyLogger.log(element, 'read limits', this);
    }
}

function DummyDateLimits(element) {
    this.min = null;
    this.max = null;

    this.toDateOrNull = function(value) {
        return value == null ? null : new Date(value);
    }

    if(typeof element !== 'undefined'){
        this.min = this.toDateOrNull(element.getAttribute('min'));
        this.max = this.toDateOrNull(element.getAttribute('max'));
    }
}

/**
 * Reads min and max limits from a date input.
 * Then if the limits contain min and max values they are
 * returned. Otherwise new values are created.
 */
export function readAndAdjustDateLimits(element){
    var limits = new DummyDateLimits(element);
    DummyLogger.log(element, 'read limits', this);

    if (limits.min != null && limits.max != null) {
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

    DummyLogger.log(element, 'adjusted limits', limits);

    return limits;
}

/**
 * Reads min and max limits from an element.
 * Then if the limits contain min and max values they are
 * returned. Otherwise new values are created for provided purpose.
 */
export function readAndAdjustMinMaxLimits(purpose, element){
    var limits = new DummyLimits(element);
    DummyLogger.log(element, 'read limits', this);


    if (limits.min != null && limits.max != null) {
        return limits;
    } else if (limits.min == null && limits.max != null){
         limits.min = new Number(chance.natural({
             min : 1,
             max : limits.min
             }));
    } else if (limits.max == null && limits.min != null){
        limits.max = new Number(chance.natural({
            min : limits.min,
            max : limits.min + 5
        }));
    } else {
        if (DummyPurposeEnum.AGE_PURPOSE === purpose) {
            limits.min = new Number(21);
            limits.max = new Number(75);
        } else if (DummyPurposeEnum.YEAR_PURPOSE === purpose) {
            limits.min = new Number(1940);
            limits.max = new Number(2015);
        } else {
            limits.min =  Number(0);
            limits.max =  Number(500);
        }
    }

    DummyLogger.log(element, 'adjusted limits', limits);

    return limits;
}

/**
 * Reads minlength and maxlength limits from an element.
 * Then if the limits contain min and max values they are
 * returned. Otherwise new values are created.
 */
export function readAndAdjustMinLengthMaxLengthLimits(element){
    let limits = new DummyLimits(element);
    DummyLogger.log(element, 'read limits', this);

    //adjusting
    if (limits.minlength != null && limits.maxlength != null) {
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
        if (element.matches('textarea')) {
            limits.minlength = 100;
            limits.maxlength = 500;
        } else {
            limits.minlength = 1;
            limits.maxlength = 15;
        }
    }

    DummyLogger.log(element, 'adjusted limits', limits);

    return limits;
};
