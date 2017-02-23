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
			}
		});

		port.onDisconnect.addListener(function(port) {

		});
	}
});