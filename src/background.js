chrome.action.onClicked.addListener((tab) => {
      chrome.tabs.sendMessage(tab.id, {greeting: "hello"});
});
