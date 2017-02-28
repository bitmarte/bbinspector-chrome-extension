$(document).ready(function() {

	var backgroundPageConnection = chrome.runtime.connect({
	    name: "devtools-page"
	});

	$('#bbInfo').on('click', BackbaseInfo.render);
	$('#itemsInPage').on('click', ItemsInPage.renderPlainList);
	$('#collapsiblePageTree').on('click', CollapsiblePageTree.render);
	$('#collapsiblePageGraph').on('click', CollapsiblePageGraph.render);

	BackbaseInfo.render();
	CollapsiblePageTree.render();

	chrome.devtools.network.onNavigated.addListener(function (url) {
    	backgroundPageConnection.postMessage({action: "onTabStatus", status: "complete"});
    	var prevStatus;
    	backgroundPageConnection.onMessage.addListener(function(message) {
    		if(message.status === "complete" && prevStatus !== "complete") {
    			BackbaseInfo.render();
				  CollapsiblePageTree.render();
				  prevStatus = message.status;
    		}
    	});
	});

});