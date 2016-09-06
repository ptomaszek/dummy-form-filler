chrome.browserAction.onClicked.addListener(function () {
    chrome.storage.local.get(
        CURRENT_OPTIONS,
        function (options) {
            chrome.storage.local.set(
                options
                , runDummyRun());
        }
    )
});


runDummyRun = function () {
    chrome.tabs.executeScript({
        file: "js/main.js"
    });
};
