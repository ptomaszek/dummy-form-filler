;
var self = require("sdk/self");
var tabs = require("sdk/tabs");

tabs.open({
	url : "http://www.google.com",
});

var system = require("sdk/system");

if (system.version >= "29.0") {
	require("sdk/ui").ActionButton(
			{
				id : "populate-button",
				label : "Dummy FF",
				icon : "./icon.ico",
				onClick : function() {

					worker = tabs.activeTab.attach({
						contentScriptFile : [
								self.data.url("jquery-2.1.0.min.js"),
								self.data.url("data.js"),
								self.data.url("engine.js") ],
						contentScriptWhen : 'ready',
						contentScript : 'populateDummyData();'
					});
				}
			});
} else {
	require("sdk/widget").Widget(
			{
				id : "populate-widget",
				label : "Dummy FF",
				contentURL : self.data.url("icon.ico"),
				onClick : function() {
					worker = tabs.activeTab.attach({
						contentScriptFile : [
								self.data.url("jquery-2.1.0.min.js"),
								self.data.url("data.js"),
								self.data.url("engine.js") ],
						contentScriptWhen : 'ready',
						contentScript : 'populateDummyData();'
					});
				}
			});
}
