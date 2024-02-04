function run(){
    console.log('registered');
    populate();
}

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: {tabId: tab.id, allFrames: true},
        func: run
    });
});
