chrome.runtime.onInstalled.addListener(initializeState);

chrome.tabs.onCreated.addListener(function (tab) {
  if (tab.url.startsWith("https://www.youtube.com/")) {
    sendCurrentStateToTab(tab.id);
  } else {
    chrome.action.disable(tab.id);
  }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  const finishedUpdatingPage = changeInfo.status === "complete";
  if (finishedUpdatingPage) {
    if (tab.url.startsWith("https://www.youtube.com/")) {
      sendCurrentStateToTab(tabId);
    }
  }
});

function initializeState() {
  // TODO: remove this before uploading extension
  chrome.storage.sync.clear();
  const state = {
    extension_active: true,
  };
  chrome.storage.sync.set(state);
}

function sendCurrentStateToTab(id) {
  chrome.storage.sync.get(null, function (state) {
    chrome.tabs.sendMessage(id, state);
  });
}
