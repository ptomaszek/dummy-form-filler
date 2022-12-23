chrome.browserAction.onClicked.addListener(() => {
    const contentScriptPath = JSON.stringify(chrome.extension.getURL('js/main.js'));
    chrome.tabs.executeScript({
        // Cannot use `file` since that does not support ES modules.
        code: `import(${contentScriptPath}).then(({ run }) => run());`
    });
});
