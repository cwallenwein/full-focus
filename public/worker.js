"use strict";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ active: false });
});

chrome.tabs.onCreated.addListener(function (tab) {
  sendCurrentStateToTabs([tab]);
});

chrome.tabs.onUpdated.addListener(function (_tabId, changeInfo, tab) {
  const finishedUpdatingPage = changeInfo.status === "complete";
  if (finishedUpdatingPage) {
    sendCurrentStateToTabs([tab]);
  }
});

function sendCurrentStateToTabs(tabs) {
  chrome.storage.local.get("active", ({ active }) => {
    sendStateToTabs(tabs, active);
  });
}

function sendStateToTabs(tabs, active) {
  tabs.forEach((tab) => {
    updateTab(tab, active);
  });
}

function updateTab(tab, active) {
  let stylesheet;
  if (
    showingHomepage(tab.url) ||
    showingSearchResults(tab.url) ||
    showingYouTubeShorts(tab.url) ||
    showingYouTubeChannels(tab.url)
  ) {
    stylesheet = {
      target: { tabId: tab.id },
      files: ["css/homepage.css"],
    };
  } else if (showingVideoplayer(tab.url)) {
    stylesheet = {
      target: { tabId: tab.id },
      files: ["css/videoplayer.css"],
    };
  } else {
    return;
  }

  if (active) {
    chrome.scripting.insertCSS(stylesheet);
  } else {
    chrome.scripting.removeCSS(stylesheet);
  }
}

function updateStorage(active) {
  chrome.storage.local.set({ active });
}

function showingHomepage(url) {
  return url == "https://www.youtube.com/" || url.startsWith("https://www.youtube.com/#");
}

function showingSearchResults(url) {
  return url.startsWith("https://www.youtube.com/results");
}

function showingVideoplayer(url) {
  return url.startsWith("https://www.youtube.com/watch");
}

function showingYouTubeShorts(url) {
  return url.startsWith("https://www.youtube.com/shorts/");
}

function showingYouTubeChannels(url) {
  return url.startsWith("https://www.youtube.com/channel/");
}
