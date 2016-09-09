chrome.browserAction.onClicked.addListener(function () {
    chrome.storage.local.get(
        DEFAULT_OPTIONS,
        function (options) {
            chrome.storage.local.set(
                options
                , runDummyRun()); //TODO delete () and check if works without the chain
        }
    )
});

runDummyRun = function () {
    chrome.tabs.executeScript({
        file: "js/main.js"
    });
};
