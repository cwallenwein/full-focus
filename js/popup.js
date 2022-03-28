// TODO remove redundant code

// TODO how to update other open Full Focus tabs in other windows

// activate extension
chrome.storage.sync.get('active', function (response) {
    var current = document.getElementById("extension")

    // check or uncheck checkboxes based on settings
    current.checked = response.active

    // add EventListener that updates the settings
    current.addEventListener("click", function () {
        // toggle setting
        response.active = !response.active

        // update icon
        chrome.browserAction.setIcon({ path: "../img/" + response.active + ".png" });

        // update setting in storage
        chrome.storage.sync.set({ active: response.active })

        // send message to content.js
        // toggles between activating all elements (as stated in the settings) or deactivating all elements
        chrome.tabs.query({ active: true }, function (tabs) {
            // TODO insert for loop here
            for (tab of tabs) {
                // if(checkURL(tabs.url))
                let message = {
                    type: response.active ? "enableExtension" : "disableExtension",
                    source: "popup.js",
                    url: tab.url
                }
                console.log(message)
                chrome.tabs.sendMessage(tab.id, message);
            }
        })
    })
})

// youtube settings
// request all settings from storage when popup is opened
// and update settings when necessary
chrome.storage.sync.get('settings', function (response) {

    // code for YouTube
    for (let key in response.settings.youtube) {
        var current = document.getElementById(key)

        // check or uncheck checkboxes based on settings
        current.checked = response.settings.youtube[key].hide

        // add EventListener that updates the settings
        current.addEventListener("click", function () {
            // toggle settings
            response.settings.youtube[key].hide = !response.settings.youtube[key].hide

            // update setting in storage
            chrome.storage.sync.set({ settings: response.settings })

            // send message to content.js
            // toggles between activating all elements (as stated in the settings) or deactivating all elements
            chrome.tabs.query({ active: true }, function (tabs) {
                // TODO insert for loop here
                for (tab of tabs) {
                    // if(checkURL(tabs.url))
                    let message = {
                        type: response.settings.youtube[key].hide ? "hideElement" : "showElement",
                        element: key,
                        source: "popup.js",
                        url: tab.url
                    }
                    console.log(message)
                    chrome.tabs.sendMessage(tab.id, message);
                }
            })
        })
    }
})