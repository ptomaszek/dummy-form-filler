Dummy Form Filler for Firefox and Chrome
----------------------------------------

**Simple extension that populates HTML forms with dummy data. 
Useful for web developers and testers.**

Get for:
- Firefox - [Add-ons page](https://addons.mozilla.org/pl/firefox/addon/dummy-form-filler/)
- Chrome - [Web Store page](https://chrome.google.com/webstore/detail/dummy-form-filler/npghpiokpleaiakfmalkmhkcloahfnad)

Try it [here](https://rawgit.com/ptomaszek/dummy-form-filler/master/show.html).

#### Features:
- Lack of features.
- Works out of the box.
- Default shortcut Alt+Shift+D (can be changed in chrome://extensions/configureCommands)
- Configurable options (basics).
- Perceives basic semantic hints (e.g. when a label contains 'age', 'year', 'phone' strings) and limitations (e.g. min, minlength).
- Click again to reset all the forms (though should keep the original values).
- Supported elements:
 - input: text, email, number, radio, checkbox, tel, password, date, url
 - select
 - textarea

Please note the logic of populating forms may not suite everyone, e.g. data that is already filled (existed before the page was loaded) will not be cleared and fitted with dummy data. If you think some behavior is terribly illogical, please give me a shout on github.

Thank you for reviews and raised issues. And for using the add-on.

-----
Recent changes in [CHANGELOG.md](CHANGELOG.md)

-----
### Development & package preparation

1. Install [npm](https://www.npmjs.com/)
1. Prepare dependencies
    ```
    npm run prepareDependencies
    ```
1. Start Firefox with the extension (development phase)
    ```
    npm run web-ext:browser -- --start-url=https://rawgit.com/ptomaszek/dummy-form-filler/master/show.html
    ```
1. Build final package
    ```
    npm run web-ext:build
    ```
