function saveOptions() {
    var options = {};
    options[DUMMY_PASSWORD_OPTION] = document.getElementById(DUMMY_PASSWORD_OPTION).value;
    options[LOG_OPTION] = document.getElementById(LOG_OPTION).checked;

    chrome.storage.local.set(options);
}

function loadOptions() {
    chrome.storage.local.get(
        CURRENT_OPTIONS
        , function (options) {
            document.getElementById(DUMMY_PASSWORD_OPTION).value = options[DUMMY_PASSWORD_OPTION];
            document.getElementById(LOG_OPTION).checked = options[LOG_OPTION];
        });
}

function resetOptions() {
    chrome.storage.local.set(CURRENT_OPTIONS);
}

document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('reset').addEventListener('click', resetOptions);
