"use strict";
let homepageShortsSearchResultsStylesheet = `
/* --- hide_recommendations --- */
body.hide_recommendations #chips-wrapper,
body.hide_recommendations ytd-browse #contents {
  display: none !important;
}

/* --- hide_thumbnails (+ video previews) --- */
body.hide_thumbnails #primary img {
  display:none !important;
}
body.hide_thumbnails #preview, body.hide_thumbnails #hover-overlays {
  display:none !important;
}

/* --- hide_sidebar --- */
body.hide_sidebar #guide-button,
body.hide_sidebar ytd-mini-guide-renderer,
body.hide_sidebar #guide-wrapper {
  display: none !important;
}

/* --- hide_shorts --- */
body.hide_shorts ytd-shorts {
  display: none !important;
}
`;
let videoPlayerStylesheet = `
/* --- hide_recommendations --- */
body.hide_recommendations #related,
body.hide_recommendations .html5-endscreen,
body.hide_recommendations .ytp-ce-video {
  display: none !important;
}

/* --- hide_thumbnails (+ video previews) --- */
body.hide_thumbnails contents img {
  display:none !important;
}
body.hide_thumbnails #preview,
body.hide_thumbnails #hover-overlays {
  display:none !important;
}

/* --- hide_playlists --- */
body.hide_playlists #playlist {
  display: none !important;
}

/* --- hide_sidebar --- */
/*body.hide_sidebar #guide-button,
body.hide_sidebar ytd-mini-guide-renderer,
body.hide_sidebar #guide-wrapper {
  display: none !important;
}*/

body.hide_sidebar ytd-guide-section-renderer:nth-child(2){
  display: none !important;
}

/* --- hide_comments --- */
body.hide_comments #comments,
body.hide_comments #chat {
  display: none !important;
}

/* --- hide_merch --- */
body.hide_merch #merch-shelf,
body.hide_merch ytd-merch-shelf-renderer {
  display: none !important;
}`;
setup();
chrome.runtime.onMessage.addListener(handleStateUpdate);
function handleStateUpdate(state, _sender, sendResponse) {
  const options = {
    hide_recommendations,
    hide_thumbnails,
    hide_playlists,
    disable_autoplay,
    hide_sidebar,
    hide_comments,
    hide_merch,
    hide_shorts,
  };
  Object.keys(options).forEach((key) => options[key](state[key]));
  sendResponse(true);
}
const hide_recommendations = (active) => toggleClass("hide_recommendations", active);
const hide_thumbnails = (active) => toggleClass("hide_thumbnails", active);
const disable_autoplay = (active) => {
  const autoplayButton = document.getElementsByClassName("ytp-autonav-toggle-button")[0];
  if (autoplayButton) {
    autoplayButton.setAttribute("aria-checked", !active);
  }
};
const hide_playlists = (active) => toggleClass("hide_playlists", active);
const hide_sidebar = (active) => toggleClass("hide_sidebar", active);
const hide_comments = (active) => toggleClass("hide_comments", active);
const hide_merch = (active) => toggleClass("hide_merch", active);
const hide_shorts = (active) => toggleClass("hide_shorts", active);
function toggleClass(className, active) {
  if (active) {
    document.body.classList.add(className);
  } else {
    document.body.classList.remove(className);
  }
}
function setup() {
  let stylesheet = document.createElement("style");
  stylesheet.title = "full_focus";
  if (showingHomepage() || showingSearchResults() || showingYouTubeShortsPage()) {
    stylesheet.innerHTML = homepageShortsSearchResultsStylesheet;
  } else if (showingVideoplayer()) {
    stylesheet.innerHTML = videoPlayerStylesheet;
  }
  document.documentElement.prepend(stylesheet);
}
function showingHomepage() {
  return location.href == "https://www.youtube.com/" || location.href.startsWith("https://www.youtube.com/#");
}
function showingSearchResults() {
  return location.href.startsWith("https://www.youtube.com/results");
}
function showingVideoplayer() {
  return location.href.startsWith("https://www.youtube.com/watch");
}
function showingYouTubeShortsPage() {
  return location.href.startsWith("https://www.youtube.com/shorts/");
}
