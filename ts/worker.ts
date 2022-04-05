//import chrome from "chrome";

chrome.runtime.onInstalled.addListener(initializeState);

chrome.tabs.onCreated.addListener(function (tab: chrome.tabs.Tab) {
  if (tab.id && tab.url && tab.url.startsWith("https://www.youtube.com/")) {
    sendCurrentStateToTab(tab.id);
  }
});

chrome.tabs.onUpdated.addListener(function (
  tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab,
) {
  const finishedUpdatingPage = changeInfo.status === "complete";
  if (finishedUpdatingPage && tab.url) {
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

function sendCurrentStateToTab(id: number) {
  chrome.storage.sync.get(null, function (state) {
    chrome.tabs.sendMessage(id, state);
  });
}
