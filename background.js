chrome.browserAction.onClicked.addListener(() => {
      run();
});

chrome.commands.onCommand.addListener(command => {
  if (command == "run-dummy-run") {
      run();
  }
});

run = function () {
    chrome.storage.local.get(
            DEFAULT_OPTIONS,
            function (options) {
                chrome.storage.local.set(
                    options, chrome.tabs.executeScript({file: "js/main.js"})
                 );
            }
        );
};
