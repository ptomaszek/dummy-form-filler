import { DEFAULT_OPTIONS, LOGGING_ENABLED_KEY } from '../options/options_defaults.js';

export class DummyLogger {
    /**
     * Prints information next to the given element. Doesn't log if there's
     * nothing to show.
     */
    static log(element, infoText, value) {
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

        chrome.storage.local.get(LOGGING_ENABLED_KEY, function(options){
            if(options[LOGGING_ENABLED_KEY]) {
                logIt();
            }
        });
    }
}
