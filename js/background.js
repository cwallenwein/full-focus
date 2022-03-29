"use strict";

console.log("background running");

// TODO not all elements are about hiding and showing stuff, for example enabling autoplay. Maybe find another name

chrome.runtime.onInstalled.addListener(setDefaultSettings());

// send message to content-script when a new tab is opened
chrome.tabs.onCreated.addListener(function (tab) {
  requestUpdateForTab(tab.id, tab.url);
});

// send message to content-script when the active tab is changed
chrome.tabs.onActivated.addListener(function (activeInfo) {
  requestUpdateForTab(activeInfo.tabId, undefined);
});

// send message to content-script when the tab is updated
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  const finishedUpdatingPage = changeInfo.status === "complete";
  if (finishedUpdatingPage) {
    requestUpdateForTab(tabId, tab.url);
  }
});

function requestUpdateForTab(pTabID, pTabURL) {
  chrome.storage.sync.get("active", function (response) {
    let message = {
      type: response.active ? "enableExtension" : "disableExtension",
      //firstTime: true, //this page was just opended for the first time
      source: "background.js",
      url: pTabURL,
    };
    console.log("send message to a certain tab", message);
    updateIcon(response.active);
    chrome.tabs.sendMessage(pTabID, message);
  });
}

function updateIcon(showIcon) {
  chrome.browserAction.setIcon({ path: "../img/" + showIcon + ".png" });
}

function setDefaultSettings() {
  let activeOnStart = true;
  let defaultSettings = {
    settings: {
      homepage: {
        hide: true,
      },
      comments: {
        hide: true,
      },
      playlists: {
        hide: true,
      },
      recommendations: {
        hide: true,
      },
      merch: {
        hide: true,
      },
      recommendationsAfterVideo: {
        hide: true,
      },
      autoplay: {
        hide: true,
      },
      chat: {
        hide: true,
      },
    },
  };

  updateIcon(activeOnStart);
  chrome.storage.sync.set({ active: activeOnStart });
  chrome.storage.sync.set(defaultSettings);
}
