window.ItemsInPage = {};

var backgroundPageConnection = chrome.runtime.connect({
    name: "devtools-page"
});

ItemsInPage.renderPlainList = function() {
	backgroundPageConnection.postMessage({action: "log", msg: "show items plain list"});
	$('#itemsInfoTable').html(Mustache.to_html(_templates.spinner));

	var itemsInfoTable = {
		tableId: "itemsInfoTable",
		tableTitle: "",
		heads: ["Type", "ItemName", "ExtendedItemName", "Detail"],
		rows: []
	};

	chrome.devtools.inspectedWindow.eval(
		SerializerUtil.buildExpressionForEval("b$.portal"),
		function (result, isException) {
			if(!isException) {
				var b$_portal = SerializerUtil.toObject(result);

				// TODO
				function logChild(child) {
					itemsInfoTable.rows.push({
						values: [
							child.nodeName,
							child.name || '',
							child.extendedItemName || '',
							'<button data-item_jxid="'+child._jxid+'" class="pure-button item-detail-action">&gt;&gt;</button>'
						]
					});
					if(child.firstChild) {
						logChild(child.firstChild);
					}
					if(child.nextSibling) {
						logChild(child.nextSibling);
					}
				}
				logChild(b$_portal.portalModel.firstChild);
				$('#itemsInfoTable').html(Mustache.to_html(_templates.defaultTable, itemsInfoTable));

				$('.item-detail-action').on('click', function(e) {
					ItemsInPage.renderItemDetail(e.target.getAttribute('data-item_jxid'));
				});
			} else {
				backgroundPageConnection.postMessage({action: "log", msg: isException});
			}
		}
	);
}

ItemsInPage.renderItemDetail = function(itemId) {
	backgroundPageConnection.postMessage({action: "log", msg: "view detail of '"+itemId+"'"});
	$('#itemsInfoTable').html(Mustache.to_html(_templates.spinner));

	var itemsInfoTable = {
		tableId: "itemsInfoTable",
		tableTitle: "Item '"+itemId+"' details",
		heads: ["Property", "Value", "Action"],
		rows: []
	};

	chrome.devtools.inspectedWindow.eval(
		SerializerUtil.buildExpressionForEval("b$.portal.portalModel.all['"+itemId+"']"),
		function (result, isException) {
			if(!isException) {
				var item = SerializerUtil.toObject(result);

				var propToVisualize = [
					'_jxid',
					'contextItemName',
					'extendedItemName',
					'localName',
					'manageable',
					'name',
					'nodeName',
					'parentItemName',
					'securityProfile',
					'tag',
					'tagName',
					'uuid'
				];

				propToVisualize.forEach(function (el) {
					if(el === 'parentItemName' && item.parentNode._jxid) {
						itemsInfoTable.rows.push({
							values: [
								el,
								item[el] || '',
								'<button data-parent_jxid="'+item.parentNode._jxid+'" class="pure-button item-detail-action">View parent</button>'
							]
						});
					}
					else {
						itemsInfoTable.rows.push({
							values: [
								el,
								item[el] || '',
								''
							]
						});
					}
				});

				// preferences
				if(item.preferences != undefined) {
					item.preferences.array.forEach(function (el) {
						itemsInfoTable.rows.push({
							values: [
								'(pref) '+el.name,
								el.value || '',
								''
							]
						});
					});
				}

				// tags
				if(item.tags != undefined) {
					item.tags.forEach(function (el) {
						itemsInfoTable.rows.push({
							values: [
								'(tags) '+el.type,
								el.value || '',
								''
							]
						});
					});
				}

				$('#itemsInfoTable').html(Mustache.to_html(_templates.defaultTable, itemsInfoTable));

				$('.item-detail-action').on('click', function(e) {
					ItemsInPage.renderItemDetail(e.target.getAttribute('data-parent_jxid'));
				});
			} else {
				backgroundPageConnection.postMessage({action: "log", msg: isException});
			}
		}
	);
}