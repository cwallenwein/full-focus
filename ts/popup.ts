document.addEventListener("DOMContentLoaded", function () {
  let activate_extension_checkbox: HTMLInputElement | null = <HTMLInputElement>(
    document.getElementById("activate_extension")
  );
  if (activate_extension_checkbox) {
    activate_extension_checkbox.addEventListener(
      "click",
      () => activate_extension_checkbox && sendStateUpdateToAllTabs(activate_extension_checkbox),
    );
  }
});

function sendStateUpdateToAllTabs(checkbox: HTMLInputElement) {
  chrome.tabs.query({ url: "https://www.youtube.com/*" }, function (tabs) {
    tabs.forEach((tab: chrome.tabs.Tab) => {
      const state = {
        extension_active: checkbox?.checked || false,
      };
      tab.id ? chrome.tabs.sendMessage(tab.id, state) : undefined;
    });
  });
}
