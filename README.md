Dummy Form Filler for Firefox and Chrome
----------------------------------------

**Simple extension that populates HTML forms with dummy data.
Useful for web developers and testers.**

Get it for:
- Chrome/Chromium - [Web Store page](https://chrome.google.com/webstore/detail/dummy-form-filler/npghpiokpleaiakfmalkmhkcloahfnad)
- Firefox - [Add-ons page](https://addons.mozilla.org/pl/firefox/addon/dummy-form-filler/)

Try it [here](https://rawgit.com/ptomaszek/dummy-form-filler/master/show.html).

#### Features:
- Works out of the box.
- Default shortcut Alt+Shift+D (can be changed in chrome://extensions/configureCommands)
- Configurable options (basics).
- Perceives basic semantic hints (e.g. when a label contains 'age', 'year', 'phone' strings) and limitations (e.g. min, minlength).
- Click again to reset all the forms (though should keep the original values).
- Supported elements:
  - input: text, email, number, radio, checkbox, tel, password, date, url
  - select
  - textarea

_Please note the logic of populating forms may not suite everyone, e.g. data that is already filled (existed before the page was loaded) will not be cleared and fitted with dummy data. If you think some behavior is terribly illogical, please give me a shout on github._

Thank you for reviews and raised issues. And for using the add-on.

-----
Recent changes in [CHANGELOG.md](CHANGELOG.md)

-----
Caveats:
- Source code exists few flavours due to browser-specific `manifest.json`, see [manifests](manifests). 
- For FF, the `browser_specific_settings` must be set in `manifest.json` in order to work with chrome.storage.**sync**
- For FF mv3 content scripts are loaded AFTER first invocation of the background scripts, so that the very first extension call doesn't work

-----
### Development & package preparation

1. Install [npm](https://www.npmjs.com/), best via [nvm](https://github.com/nvm-sh/nvm), e.g.:
   ```
   nvm install node
   ```
1. Prepare dependencies
    ```
    npm run prepare-dependencies
    ```
1. Test the extension
    - Chrome/Chromium
      `npm run web-ext:chromium-test`
    - Firefox mv2
      `npm run web-ext:firefox-mv2-test`
    - Firefox mv3
      `npm run web-ext:firefox-mv3-test`
1. Build final packages (must run the previous step first)
    - Chrome/Chromium
      `npm run web-ext:chromium-build`
     - Firefox mv2
      `npm run web-ext:firefox-mv2-build`
    - Firefox mv3
      `npm run web-ext:firefox-mv3-build`
