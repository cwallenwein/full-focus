"use strict";

const box = document.createElement("div");
box.style.cssText = "position:absolute;width:50px;height:50px;background:#555555;z-index:5000";
document.body.insertBefore(box, document.body.firstChild);

chrome.runtime.onMessage.addListener(handleStateUpdate);

function handleStateUpdate(newState, sender, sendResponse) {
  if (newState.extension_active) {
    box.style.background = "#00FF00";
  } else {
    box.style.background = "#FF0000";
  }
  sendResponse(true);
}
