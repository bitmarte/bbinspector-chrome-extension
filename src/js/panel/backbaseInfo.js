window.BackbaseInfo = {};

var backgroundPageConnection = chrome.runtime.connect({
    name: "devtools-page"
});

BackbaseInfo.render = function() {
	$('#mainInfoTable').html(Mustache.to_html(_templates.spinner));

	var mainInfoTable = {
		tableId: "mainInfoTable",
		tableTitle: "",
		heads: ["Property", "Value"],
		rows: []
	};

	chrome.devtools.inspectedWindow.eval(
		SerializerUtil.buildExpressionForEval("b$.portal"),
		function (result, isException) {
			if(!isException) {
				bbportal = SerializerUtil.toObject(result);
				mainInfoTable.rows.push(
					{
						values: [
							"config.resourceRoot",
							bbportal.config.resourceRoot
						]
					},
					{	
						values: [
							"config.serverRoot",
							bbportal.config.serverRoot
						]
					},
					{
						values: [
							"linkUUID",
							bbportal.linkUUID
						]
					},
					{
						values: [
							"loggedInUserId",
							bbportal.loggedInUserId
						]
					},
					{
						values: [
							"loggedInUserRole",
							bbportal.loggedInUserRole
						]
					},
					{
						values: [
							"portalName",
							bbportal.portalName
						]
					},
					{
						values: [
							"pageName",
							bbportal.pageName
						]
					},
					{
						values: [
							"itemsInPage",
							Object.keys(bbportal.portalModel.all).length
						]
					}
				);
				$('#mainInfoTable').html(Mustache.to_html(_templates.defaultTable, mainInfoTable));
			} else {
				backgroundPageConnection.postMessage({action: "log", msg: JSON.parse(isException)});
			}
		}
	);
}