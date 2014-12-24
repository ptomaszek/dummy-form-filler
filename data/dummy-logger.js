var DummyLogger = {}

/**
 * Prints information next to the given element. Doesn't log if there's
 * nothing to show.
 */
DummyLogger.log = function($element, infoText, value) {
    if ((value && typeof value !== 'object') || (typeof value === 'object' && Object.keys(value).length !== 0)) {
        console.log('('
            + 'id=\'' + $element.prop('id') + '\''
            + ', name=\'' + $element.prop('name') + '\''
            + ', type=\'' + $element.prop('type') + '\''
            + '): '
            + infoText + ':\n'
            + JSON.stringify(value, null, 4));
    }
}
