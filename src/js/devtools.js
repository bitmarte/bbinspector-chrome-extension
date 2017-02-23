chrome.devtools.inspectedWindow.eval(
	"b$.portal.portalName",
	{useContentScriptContext: false},
	function (result, isException) {
		var backgroundPageConnection = chrome.runtime.connect({
		    name: "devtools-page"
		});
		if(!isException) {
			backgroundPageConnection.postMessage({action:"log", msg: "Backbase portal detected '"+result+"'"});
			chrome.devtools.panels.create("Backbase inspector", "images/icon.png", "panel-min.html", function(panel) {
				panel.onShown.addListener(function(panelWindow) {
					//clean tables contents
					panelWindow.document.getElementById('itemsInfoTable').innerHTML = '';
			    });
			});
		} else {
			backgroundPageConnection.postMessage({action:"log", msg: "Backbase portal did not detect in the inspected page!"});
		}
	}
);

