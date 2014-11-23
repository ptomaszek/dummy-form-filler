var self = require("sdk/self");
var tabs = require("sdk/tabs");

var system = require("sdk/system");
var { ActionButton } = require("sdk/ui/button/action");

ActionButton({
	id : "populate-widget",
	label : "Dummy Form Filler",
	icon : self.data.url("icon.ico"),
	onClick : function() {
	worker = tabs.activeTab.attach({
		contentScriptFile : [ self.data.url("jquery-2.1.0.min.js"), self.data.url("chance.min.js"),
			self.data.url("dummy-engine.js") ],
		contentScriptWhen : 'ready',
		contentScript : 'DummyFormFiller.populateDummyData();'
	});
	}
});
