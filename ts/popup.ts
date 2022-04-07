document.addEventListener("DOMContentLoaded", function () {
  const options = Array.from(document.getElementsByTagName("input"));

  chrome.storage.sync.get(null, function (state) {
    console.log("state", state);
    options.forEach((option: HTMLInputElement) => {
      option.addEventListener("click", () => sendStateUpdateToAllTabs(options));
      option.checked = state[option.id];
    });
  });
});

function sendStateUpdateToAllTabs(options: HTMLInputElement[]) {
  const state: any = {};
  options.forEach((option) => {
    state[option.id] = option.checked;
  });

  chrome.storage.sync.set(state);

  chrome.tabs.query({ url: "https://www.youtube.com/*" }, function (tabs) {
    tabs.forEach((tab: chrome.tabs.Tab) => {
      tab.id ? chrome.tabs.sendMessage(tab.id, state) : undefined;
    });
  });
}
