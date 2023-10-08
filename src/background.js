chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: {tabId: tab.id, allFrames: true},
        files: ['js/main.js'],
    });
});
