chrome.runtime.onInstalled.addListener(initializeState);

chrome.tabs.onCreated.addListener(function (tab) {
  sendCurrentStateToTab(tab.id, tab.url);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  const finishedUpdatingPage = changeInfo.status === "complete";
  if (finishedUpdatingPage) {
    sendCurrentStateToTab(tabId, tab.url);
  }
});

function initializeState() {
  const state = {
    extension_active: true,
  };
  chrome.storage.sync.set(state);
}

function sendCurrentStateToTab(id, url) {
  if (url.startsWith("https://www.youtube.com/")) {
    chrome.storage.sync.get(null, function (state) {
      chrome.tabs.sendMessage(id, state);
    });
  }
}
