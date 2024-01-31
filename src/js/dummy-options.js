var DummyOptions = function() {

    this.getOption = (key) => {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get([key], function (items) {
                if (items[key] === undefined) {
                    let option = DEFAULT_OPTIONS[key];
                    if (option === undefined){
                        reject(`'${key}' option not found`);
                    }
                    resolve(option);
                } else {
                  resolve(items[key]);
                }
            });
        });
    };

    return this;
};
