function takeScreenshot() {
  chrome.tabs.captureVisibleTab(null, { format: "png" }, function (dataUrl) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      return;
    }
    // chrome.storage.local.set({ screenshot: dataUrl }, function () {
    //   chrome.tabs.executeScript({ file: "content.js" });
    // });
  });
}

document.getElementById("screenshot-button").addEventListener("click",function () {
  // chrome.tabs.executeScript(tabs[0].id, {file: "content.js"});
  console.log('click popup');
  document.getElementById('content').innerText = 'Hello world!';
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "addCapture"});
  });
});
