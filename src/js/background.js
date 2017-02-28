chrome.runtime.onConnect.addListener(function (port) {
	if (port.name == "devtools-page") {
		port.onMessage.addListener(function (message, sender, sendResponse){
			switch(message.action) {
				case 'log':
					console.log(message.msg);
					break;
				case 'jsInject':
					chrome.tabs.executeScript(message.tabId, {file: message.fileToInject, runAt: 'document_end'});
					break;
				case 'onTabStatus':
					chrome.tabs.onUpdated.addListener(function (tabId, changes, tabObject) {
						port.postMessage({status: changes.status});
					});
					break;
			}
		});

		port.onDisconnect.addListener(function(port) {

		});
	}
});