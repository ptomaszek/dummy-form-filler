var ui = require("sdk/ui");
var self = require("sdk/self");
var tabs = require("sdk/tabs");

var action_button = ui.ActionButton({
	id : "populate-button",
	label : "Dummy FF",
	icon : "./icon.ico",
	onClick : function() {
		worker = tabs.activeTab.attach({
			contentScriptFile : [ self.data.url("jquery-2.1.0.min.js"),
					self.data.url("data.js"), self.data.url("engine.js") ],
			contentScriptWhen : 'ready',
			contentScript : 'populateDummyData();'
		});
	}
});
