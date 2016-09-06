function saveOptions() {
    var options = {};
    options[CUSTOM_DUMMY_PASSWORD_KEY] = document.querySelector('#dummyPassword').value;
    options[LOGGING_ENABLED_KEY] = document.querySelector('#log').checked;
    options[WIPING_MODE_KEY] = document.querySelector('#wiping option:checked').value;
    chrome.storage.local.set(options);
}

function loadOptions() {
    chrome.storage.local.get(
        CURRENT_OPTIONS
        , function (options) {
            document.querySelector('#dummyPassword').value = options[CUSTOM_DUMMY_PASSWORD_KEY];
            document.querySelector('#log').checked = options[LOGGING_ENABLED_KEY];
            document.querySelector('#wiping [value="' + options[WIPING_MODE_KEY] + '"]').selected = true;
        });
}

function resetOptions() {
    chrome.storage.local.set(CURRENT_OPTIONS);
}

document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('reset').addEventListener('click', resetOptions);
