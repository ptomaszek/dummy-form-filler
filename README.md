Dummy Form Filler for Firefox
------

**Simple extension that populates HTML forms with dummy data. 
Useful for web developers and testers.**

####Features:
- Lack of features
- Works out of the box.
- Perceives basic semantic hints (e.g. when a label contains 'age', 'year', 'phone' strings) and limitations (e.g. min, minlength)
- Click again to reset all forms (should keep the original values)
- Supported elements:
 - input: text, email, number, radio, checkbox, tel, password, date, url
 - select
 - textarea

Please note the logic of populating forms may not suite everyone, e.g. data that is already filled (existed before the page was loaded) will not be cleared and fitted with dummy data. If you think some behavior is terribly illogical, please give me a shout on github.

Thank you for your time spent on raising bugs, writing patches and reviews, and for using the add-on.

####Installation:
Download **bin/dummy-form-filler.xpi** file and drag it over a Firefox window. Some OCPD-touchy icon should appear on the Toolbar.
 
---

#####TODO:
- support for other HTML elements
- consider patterns (for date, numbers, etc.)
