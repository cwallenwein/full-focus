"use strict";

/**
 * Events that can trigger showing/hiding elments:
 * - plugin popup was clicked (handled in popup script)
 * - website url was changed (handled in background script)
 * - page was reloaded (handled in background script)
 */

/**
 * runtime.onInstalled -> set default settings
 * tabs.onCreated -> request current settings and send them to the newly activated tab
 * tabs.onUpdated -> request current settings and send them to the newly activated tab
 * tabs.onActivated -> request current settings and send them to the newly activated tab
 */

console.log("background running");

chrome.runtime.onInstalled.addListener(setDefaultSettings);

// send message to content-script when a new tab is opened
chrome.tabs.onCreated.addListener(function (tab) {
  requestUpdateForTab(tab.id, tab.url);
});

// Do we really have to change anything when the tab is getting activated? No I don't think so. CSS was already injected beforehand and nothing changed regarding the plugin.
// send message to content-script when the active tab is changed
// The url of the newly activated tab might not yet be set, but onUpdated-events will be triggered once it is set
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

function requestUpdateForTab(tabId, tabUrl) {
  if (tabUrl.startsWith("https://www.youtube.com/")) {
    chrome.storage.sync.get("extension", function ({ extension }) {
      let message = {
        source: "background.js",
        url: tabUrl,
        element: extension,
        active: extension.active,
      };
      console.log("send message to a certain tab", message);
      updateIcon(response.active);
      chrome.tabs.sendMessage(tabId, message);
    });
  }
}

function updateIcon(showIcon) {
  chrome.browserAction.setIcon({ path: "../img/" + showIcon + ".png" });
}

function setDefaultSettings() {
  let activeOnStart = true;
  let defaultSettings = {
    extension: {
      active: true,
    },
    elements: {
      homepage: {
        active: false,
      },
      comments: {
        active: false,
      },
      playlists: {
        active: false,
      },
      recommendations: {
        active: false,
      },
      merch: {
        active: false,
      },
      recommendationsAfterVideo: {
        active: false,
      },
      autoplay: {
        active: false,
      },
      chat: {
        active: false,
      },
    },
  };

  updateIcon(activeOnStart);
  chrome.storage.sync.set(defaultSettings);
}
