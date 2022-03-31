/**
 * This file is triggered whenever the popup is opened
 * It sets checkboxes, icon correctly and triggers content script to update
 */

/**
 * when popup is opened:
 * - set checkboxes correctly
 * - set icon correctly
 * - add event listeners to checkboxes to update settings and send new state to all active windows
 */

// TODO remove redundant code

// TODO how to update other open Full Focus tabs in other windows

// TODO only send to YouTube tabs

// update request is sent to content script, but the content script is requesting the settings anyway.
// why not send the settings with the update request?

// activate extension

chrome.storage.sync.get("extension", function ({ active: extensionIsActive }) {
  let activateExtensionCheckbox = document.getElementById("extension");

  // check or uncheck checkboxes based on settings
  setCheckbox(activateExtensionCheckbox, extensionIsActive);

  // add EventListener that updates the settings

  // when the extension checkbox is clicked, update the settings and request a content update of all active tabs (also update icon, but not so important)
  activateExtensionCheckbox.addEventListener("click", function () {
    let activateExtensionCheckbox = document.getElementById("extension");

    // extension is activated if checkbox is checked
    extensionIsActive = activateExtensionCheckbox.checked;

    // update icon
    updateIcon(extensionIsActive);

    // update setting in storage
    chrome.storage.sync.set({ extension: { active: extensionIsActive } });

    // send update request to content.js
    requestContentUpdateForAllActiveTabs("extension", extensionIsActive);
  });
});

// settings
// request all settings from storage when popup is opened
// and update settings when necessary
chrome.storage.sync.get("elements", function ({ elements }) {
  // code for YouTube
  for (let element in elements) {
    let current = document.getElementById(element);

    // check or uncheck checkboxes based on settings
    setCheckbox(current, elements[element].hide);

    // add EventListener that updates the settings
    current.addEventListener("click", function () {
      // toggle settings
      elements[element].active = !elements[element].active;

      // update setting in storage
      chrome.storage.sync.set({ elements: elements });

      // send message to content.js
      requestContentUpdateForAllActiveTabs(element, elements[element].hide);
    });
  }
});

function loadSettingsOnPopupOpen() {}

function updateSettingsOnExtension() {}

function requestContentUpdateForAllActiveTabs(element, elementIsActive) {
  // select all active tabs
  const queryOptions = { active: true };

  chrome.tabs.query(queryOptions, function (tabs) {
    tabs.forEach((tab) => {
      if (isYoutube(tabs.url)) {
        let message = {
          source: "popup.js",
          url: tab.url,
          element: element,
          active: elementIsActive,
        };
        console.log(message);
        chrome.tabs.sendMessage(tab.id, message);
      }
    });
  });
}

function setCheckbox(element, value) {
  if (element && "checked" in element) {
    element.checked = value;
  }
}

function updateIcon(extensionActive) {
  chrome.browserAction.setIcon({ path: "../img/" + extensionActive + ".png" });
}

function isYoutube(url) {
  return url.startsWith("https://www.youtube.com/");
}
