if(chrome.runtime.getManifest().manifest_version == 2){ // firefox mv2
    chrome.browserAction.onClicked.addListener((tab) => {
        chrome.tabs.sendMessage(tab.id, {});
    });
} else { // chromium mv3 and firefox mv3
  chrome.action.onClicked.addListener((tab) => {
        chrome.tabs.sendMessage(tab.id, {});
  });
}
