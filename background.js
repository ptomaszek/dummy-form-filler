chrome.browserAction.onClicked.addListener(() => {
      chrome.storage.local.get(
                  DEFAULT_OPTIONS,
                  (options) => {
                      chrome.storage.local.set(
                          options, chrome.tabs.executeScript({file: "js/main.js"})
                      );
                  }
              );
});
