chrome.browserAction.onClicked.addListener(() => {
    chrome.tabs.executeScript({file: "js/main.js"});
});
