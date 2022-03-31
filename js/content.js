"use strict";
// TODO also fix tabs in the background when settings were changed

chrome.runtime.onMessage.addListener(handleUpdateStateRequest);

// does the content script receive updates even if it is not active at the moment? No, the popup for example only sends a message to all active tabs
// -> The popup sends to all tabs (not that scalable, all open tabs will be affected at the same time)
//    or
//    When active tab is changed, the newly active tab requests settings
//      (more scalable because this is only executed on active tabs; then background script and popup only send a message that the settings were updated to the content script, but doesn't send the settings themselves)
//    or
//    The popup sends entire state to all active tabs and newly active tab requests setting

// update request contains the entire state and is used to update the content
// but how to check if the CSS has to be injected into the header or not? Was it already injected earlier? This could be part of the state :thinkingface; but this sounds more like a message
// a message that was sent to the content script is immediately processed and is not persistent
// so we can add a key to the state object to indicate that this was the first message that was sent to a certain url. We could also just inject the CSS if it was not already injected :thinkingface

// TODO How to prevent that the css is injected into a non-Youtube header?

function handleUpdateStateRequest(newState, sender, sendResponse) {
  console.log("handle incoming state update request", newState);

  // inject CSS
  //

  // but before that check if new functionality is even needed
  if ((updateRequest.element = "extension")) {
    activateExtension(updateRequest.active);
  } else {
    activateElement(updateRequest.element, updateRequest.active);
  }
}

function activateExtension(extensionActivated) {
  if (extensionActivated) {
    chrome.storage.sync.get("elements", function ({ elements }) {
      const url = location.href;
      console.log("instructions: ", instructions);
      console.log("response in enable Extension", elements);
      for (let elementName in instructions) {
        let hideElement = instructions[elementName];
        let setting = elements[elementName].hide;
        console.log("setting", elementName, setting);
        console.log("url", url);
        hideElement(url, setting);
      }
    });
  } else {
    for (let elementName in instructions) {
      let hideElement = instructions[elementName];
      hideElement(location.href, false);
    }
  }
}

function activateElement(elementActivated) {
  const url = location.href;

  if (elementActivated) {
    let hideElement = instructions[key];
    if (hideElement != undefined) {
      hideElement(url, false);
    }
  } else {
    console.log("Hide", key, "on", url);
    let hideElement = instructions[key];
    chrome.storage.sync.get("extension", function ({ extension }) {
      if (extension.active && hideElement != undefined) {
        hideElement(url, true);
      }
    });
  }
}

function isUrlHomepage(url) {
  return url == "https://www.youtube.com/" || url.startsWith("https://www.youtube.com/#");
}

function isUrlVideoPlayer(url) {
  return url.startsWith("https://www.youtube.com/watch");
}

const instructions = {
  homepage: function (url, hide) {
    if (isUrlHomepage(url)) {
      if (hide) {
        let element = document.getElementById("stylesheetSearchbar");
        if (element != null) {
          element.disabled = false;
        }
      } else {
        let element = document.getElementById("stylesheetSearchbar");
        if (element != null) {
          element.disabled = true;
        }
      }
    }
  },
  comments: function (url, hide) {
    if (isUrlVideoPlayer(url)) {
      if (hide) {
        let element = document.getElementById("comments");
        console.log("comments", element);
        element.style.display = "none";
        console.log("no comments");
      } else {
        let element = document.getElementById("comments");
        element.style.display = "block";
        console.log("show comments");
      }
    }
  },
  playlists: function (url, hide) {
    if (isUrlVideoPlayer(url)) {
      if (hide) {
        let element = document.getElementById("playlist");
        element.style.display = "none";
        console.log("no playlists 1");
      } else {
        // only set to flex if there should even be a playlist on that page
        let element = document.getElementById("playlist");
        if (element.hasAttribute("disable-upgrade") === false) {
          element.style.display = "flex";
          console.log("show playlists");
        } else {
          element.style.display = "none";
          console.log("no playlists 2");
        }
      }
    }
  },
  // when recommendations are hidden the button for autoplay is also hidden
  // but it is still possible to click() the button
  recommendations: function (url, hide) {
    if (isUrlVideoPlayer(url)) {
      if (hide) {
        let element = document.getElementById("related");
        element.style.display = "none";
        console.log("no recommendations");
      } else {
        let element = document.getElementById("related");
        element.style.display = "block";
        console.log("show recommendations");
      }
    }
  },
  merch: function (url, hide) {
    if (isUrlVideoPlayer(url)) {
      if (hide) {
        let element = document.getElementById("merch-shelf");
        element.style.display = "none";
        console.log("no merch");
      } else {
        let element = document.getElementById("merch-shelf");
        element.style.display = "block";
        console.log("show merch");
      }
    }
  },
  recommendationsAfterVideo: function (url, hide) {
    if (isUrlVideoPlayer(url)) {
      if (hide) {
        let element = document.getElementsByClassName("ytp-endscreen-content")[0];
        element.style.display = "none";
        console.log("no recommendations after video");
      } else {
        let element = document.getElementsByClassName("ytp-endscreen-content")[0];
        element.style.display = "block";
        console.log("show recommendations after video");
      }
    }
  },
  autoplay: function (url, hide) {
    if (isUrlVideoPlayer(url)) {
      if (hide) {
        let element = document.getElementById("toggle");
        if (element != null) {
          if (element.getAttribute("aria-pressed") === "true") {
            element.click();
            console.log("disable autoplay");
          }
        }
      } else {
        let element = document.getElementById("toggle");
        if (element != null) {
          if (element.getAttribute("aria-pressed") === "false") {
            element.click();
            console.log("enable autoplay");
          }
        }
      }
    }
  },
  chat: function (url, hide) {
    if (isUrlVideoPlayer(url)) {
      if (hide) {
        let element = document.getElementById("chat");
        if (element != null) {
          element.style.display = "none";
        }
      } else {
        let element = document.getElementById("chat");
        if (element != null) {
          element.style.display = "flex";
        }
      }
    }
  },
};
