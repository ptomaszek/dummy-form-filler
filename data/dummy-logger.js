var DummyLogger = {};

/**
 * Prints information next to the given element. Doesn't log if there's
 * nothing to show.
 */
DummyLogger.log = function($element, key, value) {
    if ((value && typeof value !== 'object') || (typeof value === 'object' && Object.keys(value).length !== 0)) {
        console.log('Element id=\'' + $element.prop('id') + '\'\t- ' + key + ': ' + JSON.stringify(value, null, 4));
    }
}
