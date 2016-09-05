var DEFAULTS = {
    dummyPassword: '0Pa$$4uM^t3'
};


function saveOptions() {
    chrome.storage.local.set({
        dummyPassword: document.getElementById("dummyPassword").value
    });
}

function restoreOptions() {
    chrome.storage.local.get(
        DEFAULTS
        , function (savedOptions) {
            document.getElementById("dummyPassword").value = savedOptions.dummyPassword;
        });
}

function resetOptions() {
    chrome.storage.local.set(DEFAULTS);
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('reset').addEventListener('click', resetOptions);
