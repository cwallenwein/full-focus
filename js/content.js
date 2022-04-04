"use strict";

// TODO: detect URL change

injectCss();

chrome.runtime.onMessage.addListener(handleStateUpdate);

function handleStateUpdate(state, sender, sendResponse) {
  toggleCss(state);
  sendResponse(true);
}

function injectCss() {
  if (showingHomepage() || showingSearchResults()) {
    injectCssHomepage();
  } else if (showingVideoPlayer()) {
  }
}

function toggleCss(state) {
  for (const stylesheet of document.styleSheets) {
    if (Object.keys(state).includes(stylesheet.title)) {
      stylesheet.disabled = !state[stylesheet.title];
    }
  }
}

function showingHomepage() {
  return location.href == "https://www.youtube.com/" || location.href.startsWith("https://www.youtube.com/#");
}

function showingSearchResults() {
  return location.href.startsWith("https://www.youtube.com/results");
}

function showingVideoPlayer() {
  return location.href.startsWith("https://www.youtube.com/watch");
}

function injectCssHomepage() {
  let style = document.createElement("style");
  style.title = "extension_active";

  style.textContent = `html,
  body {
    margin: 0; height: 100%;
    overflow: hidden;
  }
  
  #start,#guide,#chips-wrapper,#items,#masthead-ad {
    display: none !important;
  }

  ytd-browse #contents{
    display: none !important;
  }
  
  #center {
    position: absolute;
    left: 15vw;
    /*top: 45vh; */
    width: 70vw !important;
    height: 10vh;
  }

  
  #end {
    position: absolute;
    top: 8px; right: 0px;
  }`;

  document.documentElement.prepend(style);
}
