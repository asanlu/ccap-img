chrome.runtime.onInstalled.addListener(function () {
  console.log("插件已被安装");
  // chrome.action.setBadgeText({
  //   text: "OFF",
  // });

});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

  if(request.action === 'screenshot'){
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // 截取屏幕截图并指定截图区域
      chrome.tabs.captureVisibleTab(null, { format: "png" }, function (dataUrl) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "saveCaptureImg", dataUrl });
      });
    });
  }
  // 消息回传
  // sendResponse({ number: request.number });
});

