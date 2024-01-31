var DummyLogger = {}

/**
 * Prints information next to the given element. Doesn't log if there's
 * nothing to show.
 */
DummyLogger.log = function (element, infoText, value) {
    function logIt() {
        if ((value && typeof value !== 'object') || (typeof value === 'object' && Object.keys(value).length !== 0)) {
            console.log('('
                + 'id=\'' + element.id + '\''
                + ', name=\'' + element.name + '\''
                + ', type=\'' + element.type + '\''
                + '): '
                + infoText + ':\n'
                + JSON.stringify(value, null, 4));
        }
    }

    chrome.storage.sync.get(['loggingEnabled'], function (items) {
        if (items['loggingEnabled']) {
                logIt();
            }
        });
};
