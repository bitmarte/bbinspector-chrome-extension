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

});