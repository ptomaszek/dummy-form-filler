function saveOptions() {
    var options = {};
    options[CUSTOM_DUMMY_PASSWORD_KEY] = document.querySelector('#dummyPassword').value;
    options[WIPING_MODE_KEY] = document.querySelector('#wiping option:checked').value;
    options[LOGGING_ENABLED_KEY] = document.querySelector('#log').checked;

    chrome.storage.local.set(options);
}

function loadOptions() {
    chrome.storage.local.get(
        DEFAULT_OPTIONS
        , function (options) {
            document.querySelector('#dummyPassword').value = options[CUSTOM_DUMMY_PASSWORD_KEY];
            document.querySelector('#log').checked = options[LOGGING_ENABLED_KEY];
            document.querySelector('#wiping [value="' + options[WIPING_MODE_KEY] + '"]').selected = true;
        });
}

function resetOptions() {
    chrome.storage.local.clear(function () {
        chrome.storage.local.set(DEFAULT_OPTIONS);
    });
}

document.addEventListener('DOMContentLoaded', loadOptions);
document.querySelector('#save').addEventListener('click', saveOptions);
document.querySelector('#reset').addEventListener('click', resetOptions);
